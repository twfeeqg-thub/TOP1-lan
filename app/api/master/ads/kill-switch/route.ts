import { NextResponse } from 'next/server'
import { pool, logAudit } from '@/lib/supabase-pool'
import type { KillSwitchState } from '@/lib/ad-types'

export const runtime = 'nodejs'

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

interface KillSwitchRow {
  id: boolean
  active: boolean
  toggled_at: Date | null
}

function mapRow(row: KillSwitchRow): KillSwitchState {
  return {
    active: row.active,
    toggled_at: row.toggled_at
      ? (row.toggled_at instanceof Date ? row.toggled_at.toISOString() : String(row.toggled_at))
      : '',
  }
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<KillSwitchRow>('SELECT id, active, toggled_at FROM core.kill_switch WHERE id = true;')
    if (result.rows.length === 0) {
      return NextResponse.json({ data: { active: false, toggled_at: '' } })
    }
    return NextResponse.json({ data: mapRow(result.rows[0]) })
  } catch (err) {
    console.error('[master:kill-switch] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب حالة الإيقاف' }, { status: 500 })
  }
}

export async function POST() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<KillSwitchRow>(
      `UPDATE core.kill_switch
       SET active = NOT active, toggled_at = now()
       WHERE id = true
       RETURNING id, active, toggled_at;`
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kill switch row missing' }, { status: 404 })
    }

    await logAudit({
      action: 'kill_switch.toggle',
      entity_type: 'kill_switch',
      entity_id: 'true',
      details: result.rows[0].active ? 'تفعيل Kill Switch' : 'إيقاف Kill Switch',
      severity: result.rows[0].active ? 'warn' : 'info',
    })

    return NextResponse.json({ data: mapRow(result.rows[0]) })
  } catch (err) {
    console.error('[master:kill-switch] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}