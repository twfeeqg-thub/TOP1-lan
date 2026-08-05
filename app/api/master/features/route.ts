import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool, logAudit } from '@/lib/supabase-pool'

export const runtime = 'nodejs'

interface FeatureRow {
  id: string
  name: string
  description: string
  slug: string
  is_active: boolean
  icon: string
  priority: string
  enabled_schools: number[]
}

interface SchoolRow {
  id: number
  name: string
}

const toggleSchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
})

const schoolSelectSchema = z.object({
  id: z.string(),
  school_ids: z.array(z.number()),
})

function mapFeature(row: FeatureRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    slug: row.slug,
    is_active: row.is_active,
    icon: row.icon,
    priority: row.priority,
    enabled_schools: row.enabled_schools ?? [],
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const featuresResult = await pool.query<FeatureRow>(
      'SELECT id, name, description, slug, is_active, icon, priority, enabled_schools FROM core.features ORDER BY created_at;'
    )
    const schoolsResult = await pool.query<SchoolRow>(
      'SELECT id, name FROM core.schools ORDER BY id;'
    )
    return NextResponse.json({
      data: featuresResult.rows.map(mapFeature),
      schools: schoolsResult.rows,
    })
  } catch (err) {
    console.error('[master:features] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب الميزات' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!pool) return dbDown()
  try {
    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await pool.query<FeatureRow>(
      `UPDATE core.features SET is_active = $2 WHERE id = $1
       RETURNING id, name, description, slug, is_active, icon, priority, enabled_schools;`,
      [parsed.data.id, parsed.data.is_active]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    await logAudit({
      action: 'feature.toggle',
      entity_type: 'feature',
      entity_id: parsed.data.id,
      details: parsed.data.is_active ? 'تفعيل ميزة' : 'إيقاف ميزة',
      severity: 'info',
    })

    return NextResponse.json({ data: mapFeature(result.rows[0]) })
  } catch (err) {
    console.error('[master:features] PATCH failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!pool) return dbDown()
  try {
    const body = await request.json()
    const parsed = schoolSelectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await pool.query<FeatureRow>(
      `UPDATE core.features SET enabled_schools = $2::int[] WHERE id = $1
       RETURNING id, name, description, slug, is_active, icon, priority, enabled_schools;`,
      [parsed.data.id, parsed.data.school_ids]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    await logAudit({
      action: 'feature.schools',
      entity_type: 'feature',
      entity_id: parsed.data.id,
      details: `تحديث المدارس المفعّلة (${parsed.data.school_ids.length})`,
      severity: 'info',
    })

    return NextResponse.json({ data: mapFeature(result.rows[0]) })
  } catch (err) {
    console.error('[master:features] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}