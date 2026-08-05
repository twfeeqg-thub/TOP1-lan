import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool, logAudit } from '@/lib/supabase-pool'

export const runtime = 'nodejs'

interface ProjectRow {
  project_slug: string
  sector_name: string
  is_active: boolean
  modules_config: any
  created_at?: Date | null
}

const createProjectSchema = z.object({
  name: z.string().min(1, 'اسم المشروع مطلوب'),
  slug: z.string().min(1, 'الكود مطلوب').regex(/^[a-z][a-z0-9-]*$/, 'slug must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens'),
  sector_name: z.string().min(1, 'اسم القطاع مطلوب'),
  modules_config: z.any().optional().default({}),
})

function mapRow(row: ProjectRow) {
  const cfg = row.modules_config ?? {}
  return {
    id: row.project_slug,
    name: cfg?.name_ar || row.project_slug,
    slug: row.project_slug,
    sector_name: row.sector_name,
    is_active: row.is_active,
    modules_config: cfg || {},
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : (row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()),
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    let rows: ProjectRow[]
    try {
      const result = await pool.query<ProjectRow>(
        'SELECT project_slug, sector_name, is_active, modules_config, created_at FROM core.project_definitions ORDER BY created_at;'
      )
      rows = result.rows
    } catch {
      // created_at may be absent in some deployments — fall back gracefully.
      const result = await pool.query<ProjectRow>(
        'SELECT project_slug, sector_name, is_active, modules_config FROM core.project_definitions;'
      )
      rows = result.rows
    }
    return NextResponse.json({ data: rows.map(mapRow) })
  } catch (err) {
    console.error('[master:projects] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب المشاريع' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!pool) return dbDown()
  try {
    const body = await request.json()
    const parsed = createProjectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO core.project_definitions (project_slug, sector_name, is_active, modules_config)
       VALUES ($1, $2, true, $3::jsonb)
       ON CONFLICT (project_slug) DO UPDATE SET
         sector_name = EXCLUDED.sector_name,
         is_active = true,
         modules_config = EXCLUDED.modules_config
       RETURNING project_slug, sector_name, is_active, modules_config;`,
      [parsed.data.slug, parsed.data.sector_name, JSON.stringify(parsed.data.modules_config)]
    )

    await logAudit({
      action: 'project.create',
      entity_type: 'project',
      entity_id: parsed.data.slug,
      details: `إنشاء مشروع "${parsed.data.name}"`,
      severity: 'info',
    })

    return NextResponse.json({ data: mapRow(result.rows[0]) }, { status: 201 })
  } catch (err) {
    console.error('[master:projects] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}