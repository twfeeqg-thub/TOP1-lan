// ============================================================
// Client Overrides API — the secured transactional delta mutator.
//
// GET    ?tenantId&projectSlug → { baseline, override, compiled, version }
// PATCH  { client_mutation_id, tenant_id, project_slug, config_override }
//        → transactional upsert that stores ONLY the deepDiff delta.
//
// Security posture:
//   - Actor resolved server-side from the signed access token, then the live
//     `core.users` row (is_active + tenant scope) is re-confirmed.
//   - SaaS Gatekeeper enforced on every request (403 unless tenant owner +
//     active subscription; super_admin bypass).
//   - Dedicated pg connection from the pooler (port 6543, SSL) with a strict
//     BEGIN → COMMIT / ROLLBACK transaction.
//   - `set_config('request.jwt.claims', …)` is the FIRST query inside the
//     transaction so the DB audit trigger `trg_project_overrides_audit`
//     captures the real actor in `core.master_audit_log`.
//   - Idempotency guard via `core.master_outbox.client_mutation_id`.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { PoolClient } from 'pg';
import { pool } from '@/lib/supabase-pool';
import {
  resolveClientActorFromRequest,
  enforceClientProjectAccess,
  getProjectConfigForClient,
  ClientAccessError,
} from '@/lib/client-config';
import { deepMerge, deepDiff, type JsonObject } from '@/lib/overrides-merge';
import { invalidateKpiCache } from '@/lib/kpi-cache';

export const runtime = 'nodejs';

const patchSchema = z.object({
  client_mutation_id: z.string().min(1, 'client_mutation_id مطلوب'),
  tenant_id: z.string().min(1, 'tenant_id مطلوب'),
  project_slug: z.string().min(1, 'project_slug مطلوب'),
  config_override: z.record(z.string(), z.unknown()).optional().default({}),
});

function jsonObject(value: unknown): JsonObject {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return {};
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });
}

function toNextError(err: unknown): NextResponse {
  if (err instanceof ClientAccessError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('[client:overrides] failed', err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  if (!pool) return dbDown();
  try {
    const actor = await resolveClientActorFromRequest(request);
    if (!actor) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId') ?? '';
    const projectSlug = url.searchParams.get('projectSlug') ?? '';
    if (!tenantId || !projectSlug) {
      return NextResponse.json({ error: 'tenantId و projectSlug مطلوبان' }, { status: 400 });
    }

    await enforceClientProjectAccess(actor, tenantId, projectSlug);

    const config = await getProjectConfigForClient(tenantId, projectSlug);
    if (!config) {
      return NextResponse.json({ error: 'المشروع غير موجود أو غير مفعّل' }, { status: 404 });
    }

    return NextResponse.json(config);
  } catch (err) {
    return toNextError(err);
  }
}

export async function PATCH(request: NextRequest) {
  if (!pool) return dbDown();

  let client: PoolClient | null = null;
  try {
    const actor = await resolveClientActorFromRequest(request);
    if (!actor) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { client_mutation_id, tenant_id, project_slug, config_override } = parsed.data;

    await enforceClientProjectAccess(actor, tenant_id, project_slug);

    const current = await getProjectConfigForClient(tenant_id, project_slug);
    if (!current) {
      return NextResponse.json({ error: 'المشروع غير موجود أو غير مفعّل' }, { status: 404 });
    }

    client = await pool.connect();

    await client.query('BEGIN');

    // TRIGGER ACTOR INJECTION — MUST be the first query in the transaction.
    // The audit trigger reads `request.jwt.claims` which is NULL under a
    // native pg pool connection; injecting `{"sub": actorId}` lets it write
    // the forensic `override.update` row with the real user_id.
    await client.query(
      `SELECT set_config('request.jwt.claims', $1::text, true);`,
      [JSON.stringify({ sub: actor.userId })]
    );

    // IDEMPOTENCY GUARD — a processed client_mutation_id is never re-applied.
    const existing = await client.query(
      'SELECT id FROM core.master_outbox WHERE client_mutation_id = $1;',
      [client_mutation_id]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK').catch(() => undefined);
      client.release();
      client = null;
      return NextResponse.json({ data: { applied: true, duplicated: true } });
    }

    // Delta Overrides: only the real changes vs baseline are persisted.
    const baseline = jsonObject(current.baseline);
    const desired = deepMerge(baseline, jsonObject(config_override));
    const delta = deepDiff(baseline, desired);

    const upsert = await client.query<{ version: number; config_override: unknown }>(
      `INSERT INTO core.project_overrides
         (tenant_id, project_slug, config_override, version, is_active, updated_by)
       VALUES ($1, $2, $3::jsonb, 1, true, $4)
       ON CONFLICT (tenant_id, project_slug) DO UPDATE SET
         config_override = EXCLUDED.config_override,
         version = core.project_overrides.version + 1,
         is_active = true,
         updated_by = EXCLUDED.updated_by
       RETURNING version, config_override;`,
      [tenant_id, project_slug, JSON.stringify(delta), actor.userId]
    );

    // Idempotency ledger row — records the applied mutation atomically.
    await client.query(
      `INSERT INTO core.master_outbox
         (client_mutation_id, action, entity_type, entity_id, payload, status, attempts, performed_by, performed_at)
       VALUES ($1, 'override.update', 'project_override', $2, $3::jsonb, 'applied', 0, $4, now());`,
      [client_mutation_id, project_slug, JSON.stringify({ config_override: delta }), actor.userId]
    );

    await client.query('COMMIT');
    client.release();
    client = null;

    invalidateKpiCache(`client-config:${tenant_id}:${project_slug}`);

    const applied = upsert.rows[0];
    return NextResponse.json({
      data: {
        applied: true,
        version: applied?.version ?? current.version + 1,
        config_override: applied?.config_override ?? delta,
      },
    });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => undefined);
      client.release();
    }
    return toNextError(err);
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}