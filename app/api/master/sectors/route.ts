import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool, logAudit } from '@/lib/supabase-pool'

export const runtime = 'nodejs'

const createSectorSchema = z.object({
  name: z.string().min(1, 'اسم القطاع مطلوب'),
  slug: z.string().min(1, 'الكود مطلوب').regex(/^[a-z][a-z0-9-]*$/, 'slug must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens'),
  icon: z.string().optional().default('FolderKanban'),
})

interface SectorRow {
  id: string
  name: string
  slug: string
  icon: string
  is_active: boolean
  created_at: Date
}

function mapRow(row: SectorRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    is_active: row.is_active,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<{ id: string; name: string; slug: string; icon: string; is_active: boolean; created_at: Date }>(
      'SELECT id, name, slug, icon, is_active, created_at FROM core.sectors ORDER BY created_at;'
    )
    return NextResponse.json({ data: result.rows.map(mapRow) })
  } catch (err) {
    console.error('[master:sectors] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب القطاعات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!pool) return dbDown()
  try {
    const body = await request.json()
    const parsed = createSectorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const id = `${parsed.data.slug}-${Date.now()}`
    const result = await pool.query(
      `INSERT INTO core.sectors (id, name, slug, icon, is_active, full_data)
       VALUES ($1, $2, $3, $4, true, '{}'::jsonb)
       RETURNING id, name, slug, icon, is_active, created_at;`,
      [id, parsed.data.name, parsed.data.slug, parsed.data.icon]
    )

    await logAudit({
      action: 'sector.create',
      entity_type: 'sector',
      entity_id: id,
      details: `إنشاء قطاع "${parsed.data.name}"`,
      severity: 'info',
    })

    return NextResponse.json({ data: mapRow(result.rows[0]) }, { status: 201 })
  } catch (err) {
    console.error('[master:sectors] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}