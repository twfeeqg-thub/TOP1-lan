import { NextRequest, NextResponse } from 'next/server'
import { pool, logAudit } from '@/lib/supabase-pool'
import type { SectorData } from '@/lib/sector-types'

export const runtime = 'nodejs'

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  if (!pool) return dbDown()
  const { sectorId } = await params
  try {
    const result = await pool.query('SELECT full_data FROM core.sectors WHERE id = $1;', [sectorId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
    }
    return NextResponse.json({ data: result.rows[0].full_data })
  } catch (err) {
    console.error('[master:sector] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب بيانات القطاع' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  if (!pool) return dbDown()
  const { sectorId } = await params
  try {
    const exists = await pool.query('SELECT id FROM core.sectors WHERE id = $1;', [sectorId])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
    }

    const body = await request.json()

    // Toggle mode: the summary page sends `{ is_active }` alone to flip the switch.
    if (typeof body === 'object' && body !== null && 'is_active' in body && typeof body.is_active === 'boolean') {
      await pool.query('UPDATE core.sectors SET is_active = $1 WHERE id = $2;', [body.is_active, sectorId])
      await logAudit({
        action: 'sector.toggle',
        entity_type: 'sector',
        entity_id: sectorId,
        details: body.is_active ? 'تفعيل القطاع' : 'إيقاف القطاع',
        severity: 'info',
      })
      const updated = await pool.query('SELECT full_data FROM core.sectors WHERE id = $1;', [sectorId])
      return NextResponse.json({ data: updated.rows[0].full_data })
    }

    // Full save mode: the edit page sends the whole SectorData tree.
    const data = body as SectorData
    await pool.query(
      'UPDATE core.sectors SET full_data = $1::jsonb WHERE id = $2;',
      [JSON.stringify(data), sectorId]
    )
    await logAudit({
      action: 'sector.update',
      entity_type: 'sector',
      entity_id: sectorId,
      details: 'تحديث بيانات القطاع الكاملة',
      severity: 'info',
    })
    return NextResponse.json({ data })
  } catch (err) {
    console.error('[master:sector] PUT failed', err)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  if (!pool) return dbDown()
  const { sectorId } = await params
  try {
    const result = await pool.query('DELETE FROM core.sectors WHERE id = $1 RETURNING id;', [sectorId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
    }
    await logAudit({
      action: 'sector.delete',
      entity_type: 'sector',
      entity_id: sectorId,
      severity: 'warn',
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[master:sector] DELETE failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}