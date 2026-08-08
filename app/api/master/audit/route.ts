import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/supabase-pool'
import {
  getActionLabel,
  normalizeSeverity,
  type AuditLogEntry,
} from '@/lib/audit-log'

export const runtime = 'nodejs'

interface AuditRow {
  id: string
  action: string
  user_id: string | null
  actor_name: string | null
  actor_role: string | null
  entity_type: string | null
  entity_id: string | null
  details: string | null
  severity: string
  created_at: Date
}

async function fetchAudit(limit: number): Promise<{ data: AuditLogEntry[] }> {
  if (!pool) throw new Error('DATABASE_URL not configured')
  const result = await pool.query<AuditRow>(
    `SELECT a.id, a.action, a.user_id, u.name AS actor_name, u.role AS actor_role,
            a.entity_type, a.entity_id, a.details, a.severity, a.created_at
     FROM core.master_audit_log a
     LEFT JOIN core.users u ON u.id = a.user_id
     ORDER BY a.created_at DESC
     LIMIT $1;`,
    [limit]
  )
  return {
    data: result.rows.map((row) => ({
      id: row.id,
      action: getActionLabel(row.action),
      action_key: row.action,
      actor: row.actor_name || 'النظام',
      actor_role: row.actor_role,
      target_type: row.entity_type,
      target_name: row.entity_id,
      timestamp:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      severity: normalizeSeverity(row.severity),
      details: row.details,
    })),
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const rawLimit = Number(url.searchParams.get('limit'))
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 200) : 50
    const data = await fetchAudit(limit)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=15',
      },
    })
  } catch (err) {
    console.error('[master:audit] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب سجل التدقيق' }, { status: 500 })
  }
}
