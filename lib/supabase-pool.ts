import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false },
    })
  : null;

if (databaseUrl) {
  pool!.on('error', (err) => {
    console.error('[supabase-pool] unexpected idle client error', err);
  });
}

export interface AuditLogEntry {
  action: string;
  user_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  details?: string | null;
  severity?: 'info' | 'medium' | 'high' | null;
  actor_role?: string | null;
  performed_at?: string | null;
  client_mutation_id?: string | null;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  if (!pool) {
    console.warn('[supabase-pool] logAudit skipped: DATABASE_URL is not set');
    return;
  }
  try {
    await pool.query(
      `INSERT INTO core.master_audit_log
         (action, user_id, entity_type, entity_id, details, severity,
          actor_role, performed_at, client_mutation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        entry.action,
        entry.user_id ?? null,
        entry.entity_type ?? null,
        entry.entity_id ?? null,
        entry.details ?? null,
        entry.severity ?? 'info',
        entry.actor_role ?? null,
        entry.performed_at ?? new Date().toISOString(),
        entry.client_mutation_id ?? null,
      ],
    );
  } catch (err) {
    console.error('[supabase-pool] logAudit failed', err);
  }
}

export function getPoolAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'core' },
  });
}

let cachedPoolClient: ReturnType<typeof getPoolAdminClient> | null = null;

export const poolAdmin = {
  get client() {
    if (!cachedPoolClient) {
      cachedPoolClient = getPoolAdminClient();
    }
    return cachedPoolClient;
  },
};
