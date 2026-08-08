import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/supabase-pool'
import { withMasterTx, resolveMasterActorFromRequest } from '@/lib/master-tx'

export const runtime = 'nodejs'

const createSectorSchema = z.object({
  name: z.string().min(1, 'اسم القطاع مطلوب'),
  slug: z.string().min(1, 'الكود مطلوب').regex(/^[a-z][a-z0-9-]*$/, 'slug must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens'),
  icon: z.string().optional().default('FolderKanban'),
  display_order: z.number().int().min(0).optional().default(0),
})

interface SectorRow {
  id: string
  name: string
  slug: string
  icon: string
  is_active: boolean
  display_order: number
  description: string
  created_at: Date
}

function mapRow(row: SectorRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    is_active: row.is_active,
    display_order: row.display_order ?? 0,
    description: row.description ?? '',
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<SectorRow>(
      `SELECT id, name, slug, icon, is_active, display_order,
              COALESCE(full_data->'hero'->>'description', '') AS description, created_at
       FROM core.sectors
       ORDER BY display_order ASC, created_at ASC;`
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
    const actor = await resolveMasterActorFromRequest(request)
    if (!actor) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createSectorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const id = `${parsed.data.slug}-${Date.now()}`
    const data = await withMasterTx(actor, async (tx) => {
      const result = await tx.query<SectorRow>(
        `INSERT INTO core.sectors (id, name, slug, icon, is_active, full_data, display_order)
         VALUES ($1, $2, $3, $4, true, '{}'::jsonb, $5)
         RETURNING id, name, slug, icon, is_active, display_order,
                   COALESCE(full_data->'hero'->>'description', '') AS description, created_at;`,
        [id, parsed.data.name, parsed.data.slug, parsed.data.icon, parsed.data.display_order]
      )
      return {
        data: result.rows[0],
        audit: {
          action: 'sector.create',
          entity_type: 'sector',
          entity_id: id,
          details: `إنشاء قطاع "${parsed.data.name}"`,
          severity: 'info' as const,
        },
      }
    })

    return NextResponse.json({ data: mapRow(data) }, { status: 201 })
  } catch (err: unknown) {
    console.error('[master:sectors] POST failed', err)
    if (err instanceof Error && 'status' in err && (err as any).status === 503) {
      return dbDown()
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
