import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { PoolClient } from 'pg'
import { pool } from '@/lib/supabase-pool'
import { resolveMasterActorFromRequest } from '@/lib/auth-session'

export const runtime = 'nodejs'

const outboxSchema = z.object({
  client_mutation_id: z.string().min(1),
  action: z.string().min(1),
  entity_type: z.string().min(1),
  entity_id: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
})

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

function replayError(message: string): { ok: false; error: string } {
  return { ok: false, error: message }
}

async function applyMutation(
  client: PoolClient,
  action: string,
  payload: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const data = payload as Record<string, any>

  switch (action) {
    case 'project.upsert': {
      await client.query(
        `INSERT INTO core.project_definitions (project_slug, sector_name, is_active, modules_config)
         VALUES ($1, $2, true, $3::jsonb)
         ON CONFLICT (project_slug) DO UPDATE SET
           sector_name = EXCLUDED.sector_name,
           is_active = true,
           modules_config = EXCLUDED.modules_config;`,
        [data.slug, data.sector_name ?? '', JSON.stringify(data.modules_config ?? {})]
      )
      return { ok: true }
    }
    case 'sector.upsert': {
      await client.query(
        `INSERT INTO core.sectors (id, name, slug, icon, is_active, full_data)
         VALUES ($1, $2, $3, $4, COALESCE($5, true), $6::jsonb)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           icon = EXCLUDED.icon,
           is_active = EXCLUDED.is_active,
           full_data = EXCLUDED.full_data;`,
        [data.id, data.name, data.slug, data.icon ?? 'FolderKanban', data.is_active ?? true, JSON.stringify(data.full_data ?? {})]
      )
      return { ok: true }
    }
    case 'sector.toggle': {
      await client.query('UPDATE core.sectors SET is_active = $1 WHERE id = $2;', [data.is_active, data.id])
      return { ok: true }
    }
    case 'feature.toggle': {
      await client.query('UPDATE core.features SET is_active = $1 WHERE id = $2;', [data.is_active, data.id])
      return { ok: true }
    }
    case 'feature.schools': {
      await client.query(
        'UPDATE core.features SET enabled_schools = $2::int[] WHERE id = $1;',
        [data.id, data.school_ids ?? []]
      )
      return { ok: true }
    }
    case 'ad.create': {
      const cfg = data.ad_config ?? {}
      await client.query(
        `INSERT INTO core.ads_engine (campaign_name, ad_config, media_url, request_id, status, is_active)
         VALUES ($1, $2::jsonb, $3, $4, $5, $5 = 'active');`,
        [cfg.title ?? null, JSON.stringify(cfg), data.media_url ?? null, data.request_id ?? null, data.status ?? 'inactive']
      )
      return { ok: true }
    }
    case 'ad.update': {
      await client.query(
        `UPDATE core.ads_engine
         SET ad_config = $2::jsonb,
             media_url = COALESCE($3, media_url),
             status = COALESCE($4, status),
             is_active = COALESCE($4, status) = 'active'
         WHERE id = $1;`,
        [data.id, JSON.stringify(data.ad_config ?? {}), data.media_url ?? null, data.status ?? null]
      )
      return { ok: true }
    }
    case 'ad_request.review': {
      await client.query(
        `UPDATE core.ad_requests SET status = $2, updated_at = now() WHERE id = $1;`,
        [data.id, data.status]
      )
      return { ok: true }
    }
    case 'kill_switch.toggle': {
      await client.query(
        `UPDATE core.kill_switch SET active = NOT active, toggled_at = now() WHERE id = true;`
      )
      return { ok: true }
    }
    default:
      return replayError(`Unknown outbox action: ${action}`)
  }
}

export async function POST(request: NextRequest) {
  if (!pool) return dbDown()
  let client: PoolClient | null = null
  try {
    const actor = await resolveMasterActorFromRequest(request)
    if (!actor) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = outboxSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    client = await pool.connect()

    // Idempotency: a client_mutation_id already recorded is never re-applied.
    const existing = await client.query(
      'SELECT id FROM core.master_outbox WHERE client_mutation_id = $1;',
      [parsed.data.client_mutation_id]
    )
    if (existing.rows.length > 0) {
      client.release()
      client = null
      return NextResponse.json({ data: { applied: true, duplicated: true } })
    }

    await client.query('BEGIN')

    const result = await applyMutation(client, parsed.data.action, parsed.data.payload)
    if (!result.ok) {
      await client.query('ROLLBACK')
      client.release()
      client = null
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    await client.query(
      `INSERT INTO core.master_outbox
         (client_mutation_id, action, entity_type, entity_id, payload, status, attempts, performed_by, performed_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, 'applied', 0, $6, now());`,
      [
        parsed.data.client_mutation_id,
        parsed.data.action,
        parsed.data.entity_type,
        parsed.data.entity_id ?? null,
        JSON.stringify(parsed.data.payload),
        actor.userId,
      ]
    )

    await client.query(
      `INSERT INTO core.master_audit_log
         (action, user_id, entity_type, entity_id, details, severity, actor_role, performed_at, client_mutation_id)
       VALUES ($1, $2, $3, $4, $5, 'info', $6, now(), $7);`,
      [
        'outbox.apply',
        actor.userId,
        parsed.data.entity_type,
        parsed.data.entity_id ?? null,
        `تطبيق عملية مؤجلة (${parsed.data.action})`,
        actor.role,
        parsed.data.client_mutation_id,
      ]
    )

    await client.query('COMMIT')
    client.release()
    client = null

    return NextResponse.json({ data: { applied: true } })
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => undefined)
      client.release()
    }
    console.error('[master:sync:outbox] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
