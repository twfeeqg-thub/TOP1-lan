import type { PoolClient } from 'pg'
import { pool } from '@/lib/supabase-pool'
import { resolveMasterActorFromRequest, type MasterActor } from '@/lib/auth-session'

export const runtime = 'nodejs'

export type AuditSeverity = 'info' | 'medium' | 'high'

/**
 * Minimal audit entry required for every master-panel mutation. Written to
 * `core.master_audit_log` inside the SAME PostgreSQL transaction as the write
 * itself (Task 1 — strict atomicity: write + audit commit together or roll
 * back together).
 */
export interface AuditEntry {
  action: string
  entity_type?: string | null
  entity_id?: string | null
  details?: string | null
  severity?: AuditSeverity | null
  client_mutation_id?: string | null
}

export interface TxResult<T> {
  data: T
  audit: AuditEntry
}

/** Throw inside the transactional callback to ROLLBACK with a JSON-safe HTTP status. */
export class MasterTxError extends Error {
  readonly status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'MasterTxError'
    this.status = status
  }
}

export function dbUnavailable(): never {
  throw new MasterTxError('DATABASE_URL not configured', 503)
}

/**
 * Strict PostgreSQL transaction for master-panel mutations.
 *
 * ```ts
 * const result = await withMasterTx(actor, async (tx) => {
 *   const { rows } = await tx.query(...)
 *   return {
 *     data: rows[0],
 *     audit: { action: 'sector.create', entity_type: 'sector', entity_id: id },
 *   }
 * })
 * ```
 *
 * BEGIN → business writes → audit row insert → COMMIT. Any throw → ROLLBACK
 * (no partial state, no orphan audit entry). Acquires a dedicated connection
 * from the pooler (port 6543, SSL) so the transaction is never interleaved.
 */
export async function withMasterTx<T>(
  actor: MasterActor,
  fn: (tx: PoolClient) => Promise<TxResult<T>>
): Promise<T> {
  if (!pool) dbUnavailable()

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { data, audit } = await fn(client)

    await client.query(
      `INSERT INTO core.master_audit_log
         (action, user_id, entity_type, entity_id, details, severity,
          actor_role, performed_at, client_mutation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now(), $8)`,
      [
        audit.action,
        actor.userId,
        audit.entity_type ?? null,
        audit.entity_id ?? null,
        audit.details ?? null,
        audit.severity ?? 'info',
        actor.role,
        audit.client_mutation_id ?? null,
      ]
    )

    await client.query('COMMIT')
    return data
  } catch (err) {
    await client.query('ROLLBACK').catch(() => undefined)
    throw err
  } finally {
    client.release()
  }
}

export { resolveMasterActorFromRequest }
export type { PoolClient }
