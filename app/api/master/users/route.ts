import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/supabase-pool'
import { resolveMasterActorFromRequest } from '@/lib/master-tx'

export const runtime = 'nodejs'

interface UserRow {
  id: string
  name: string | null
  phone: string
  role: string
  is_active: boolean
  created_at: Date
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET(request: NextRequest) {
  if (!pool) return dbDown()

  const actor = await resolveMasterActorFromRequest(request)
  if (!actor) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  if (actor.role !== 'super_admin') {
    return NextResponse.json({ error: 'غير مصرح بهذه الصلاحية' }, { status: 403 })
  }

  try {
    const result = await pool.query<UserRow>(
      `SELECT id, name, phone, role, is_active, created_at
       FROM core.users
       ORDER BY created_at DESC, name ASC;`
    )
    const data = result.rows.map((row) => ({
      id: row.id,
      name: row.name ?? '',
      phone: row.phone,
      role: row.role,
      is_active: row.is_active,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    }))
    return NextResponse.json({ data })
  } catch (err) {
    console.error('[master:users] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب المستخدمين' }, { status: 500 })
  }
}
