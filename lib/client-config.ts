// ============================================================
// Client Configuration Loader (Phase 4 — Client SaaS Layer)
//
// Server-side only. Resolves an authenticated actor strictly from the
// server-signed access token (Bearer header or the `aisahl_access_token`
// cookie), re-confirms their live `core.users` row (is_active + tenant
// scope), enforces the SaaS Gatekeeper, and compiles the unified runtime
// config as deepMerge(baseline, override).
//
// Performance: wrapped in the shared `getOrCompute` cache (TTL 30s,
// single-flight) so low-RAM mobile clients never stampede the pool.
// ============================================================

import { NextRequest } from 'next/server';
import { pool } from '@/lib/supabase-pool';
import { verifyAccessToken, ACCESS_COOKIE_NAME, type AuthRole } from '@/lib/auth';
import { getOrCompute } from '@/lib/kpi-cache';
import { deepMerge, type JsonObject } from '@/lib/overrides-merge';

export const runtime = 'nodejs';

export interface ClientActor {
  userId: string;
  role: AuthRole;
  tenantId: string | null;
}

export interface ClientProjectConfig {
  projectSlug: string;
  tenantId: string;
  baseline: JsonObject;
  override: JsonObject;
  compiled: JsonObject;
  version: number;
}

/** Raised by the SaaS Access Gatekeeper — 403 forbidden, 404 not found,
 *  503 when DATABASE_URL is missing. */
export class ClientAccessError extends Error {
  readonly status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = 'ClientAccessError';
    this.status = status;
  }
}

export function clientDbUnavailable(): never {
  throw new ClientAccessError('DATABASE_URL not configured', 503);
}

interface UserRow {
  id: string;
  role: AuthRole;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
}

interface DefinitionRow {
  project_slug: string;
  is_active: boolean;
  modules_config: unknown;
}

interface OverrideRow {
  config_override: unknown;
  version: number;
  is_active: boolean;
}

interface SubscriptionRow {
  id: string;
}

/**
 * Steadfast actor resolver for the `/api/client/*` + `/client/*` surface.
 * Like `resolveMasterActorFromRequest`, identity NEVER comes from the client:
 * the signed access token (Bearer header or `aisahl_access_token` cookie) is
 * only a pointer — the authoritative user (role, is_active) and the tenant
 * scope (`users.metadata->>'tenant_id'`) are re-read live from `core.users`.
 */
export async function resolveClientActorFromRequest(request: NextRequest): Promise<ClientActor | null> {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ')
    ? header.slice(7)
    : (request.cookies.get(ACCESS_COOKIE_NAME)?.value ?? null);
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  if (!pool) clientDbUnavailable();

  const { rows } = await pool!.query<UserRow>(
    `SELECT id, role, is_active, metadata
       FROM core.users
      WHERE id = $1
      LIMIT 1;`,
    [payload.userId]
  );

  const user = rows[0];
  if (!user || !user.is_active) return null;

  const tenantIdRaw = user.metadata?.['tenant_id'];
  const tenantId = typeof tenantIdRaw === 'string' && tenantIdRaw.length > 0 ? tenantIdRaw : null;

  return { userId: user.id, role: user.role, tenantId };
}

/**
 * SaaS Access Gatekeeper — enforced INSIDE every client-facing route.
 *   super_admin  → bypass (any tenant).
 *   regular user → 403 unless `metadata.tenant_id === tenantId` AND an active
 *                  `core.user_subscriptions` row exists for `projectSlug`.
 */
export async function enforceClientProjectAccess(
  actor: ClientActor,
  tenantId: string,
  projectSlug: string
): Promise<void> {
  if (actor.role === 'super_admin') return;

  if (!actor.tenantId || actor.tenantId !== tenantId) {
    throw new ClientAccessError('FORBIDDEN: tenant scope mismatch', 403);
  }

  if (!pool) clientDbUnavailable();

  const { rows } = await pool!.query<SubscriptionRow>(
    `SELECT id
       FROM core.user_subscriptions
      WHERE user_id = $1
        AND project_slug = $2
        AND is_active = true
      LIMIT 1;`,
    [actor.userId, projectSlug]
  );

  if (!rows[0]) {
    throw new ClientAccessError('FORBIDDEN: no active subscription for project', 403);
  }
}

function toJsonObject(value: unknown): JsonObject {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return {};
}

/**
 * Core resolver (cached, single-flight). Not a route — pure data assembly:
 *   compiled = deepMerge(baseline modules_config, override config_override)
 *
 * Returns `null` when the project definition is missing or inactive.
 * NOTE: authorization is NOT applied here; callers must run
 * `enforceClientProjectAccess` first (or rely on a route wrapper).
 */
export async function getProjectConfigForClient(
  tenantId: string,
  projectSlug: string
): Promise<ClientProjectConfig | null> {
  if (!pool) clientDbUnavailable();

  return getOrCompute<ClientProjectConfig | null>(
    `client-config:${tenantId}:${projectSlug}`,
    30_000,
    async () => {
      const projectResult = await pool!.query<DefinitionRow>(
        `SELECT project_slug, is_active, modules_config
           FROM core.project_definitions
          WHERE project_slug = $1
          LIMIT 1;`,
        [projectSlug]
      );

      const project = projectResult.rows[0];
      if (!project || !project.is_active) return null;

      const overrideResult = await pool!.query<OverrideRow>(
        `SELECT config_override, version, is_active
           FROM core.project_overrides
          WHERE tenant_id = $1
            AND project_slug = $2
          LIMIT 1;`,
        [tenantId, projectSlug]
      );

      const baseline = toJsonObject(project.modules_config);
      const row = overrideResult.rows[0];
      const override = row && row.is_active ? toJsonObject(row.config_override) : {};

      return {
        projectSlug: project.project_slug,
        tenantId,
        baseline,
        override,
        compiled: deepMerge(baseline, override),
        version: row?.version ?? 1,
      };
    }
  );
}