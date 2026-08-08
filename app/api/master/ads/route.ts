import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/supabase-pool'
import { withMasterTx, resolveMasterActorFromRequest } from '@/lib/master-tx'
import type { Ad } from '@/lib/ad-types'

export const runtime = 'nodejs'

const createAdSchema = z.object({
  ad_config: z.object({
    title: z.string().min(1, 'عنوان الإعلان مطلوب'),
    description: z.string().min(1, 'الوصف مطلوب'),
    targetUrl: z.string().min(1, 'رابط الهدف مطلوب'),
    placement: z.enum(['top', 'middle', 'bottom']),
    display_space: z.enum(['Login', 'Full_Screen', 'Banner', 'Native']),
    lang: z.enum(['ar', 'en']).default('ar'),
    is_exclusive: z.boolean().default(false),
    is_fixed: z.boolean().default(false),
    cta_type: z.enum(['visit', 'call', 'whatsapp', 'subscribe']).optional(),
  }),
  media_url: z.string().optional(),
  request_id: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
})

const updateAdSchema = z.object({
  id: z.string().min(1),
  ad_config: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    targetUrl: z.string().optional(),
    placement: z.enum(['top', 'middle', 'bottom']).optional(),
    display_space: z.enum(['Login', 'Full_Screen', 'Banner', 'Native']).optional(),
    lang: z.enum(['ar', 'en']).optional(),
    is_exclusive: z.boolean().optional(),
    is_fixed: z.boolean().optional(),
    cta_type: z.enum(['visit', 'call', 'whatsapp', 'subscribe']).optional(),
  }),
  media_url: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

interface AdRow {
  id: string
  ad_config: any
  campaign_name: string | null
  media_url: string | null
  request_id: string | null
  status: string | null
  is_active: boolean
  clicks: number
  impressions: number
  budget: string | null
  platform: string | null
  created_at: Date
}

const AD_SELECT = `id, ad_config, campaign_name, media_url, request_id, status, is_active,
                   clicks, impressions, budget, platform, created_at`

function mapRow(row: AdRow): Ad {
  return {
    id: row.id,
    ad_config: row.ad_config ?? {},
    media_url: row.media_url ?? undefined,
    request_id: row.request_id ?? undefined,
    status: (row.status as Ad['status']) || (row.is_active ? 'active' : 'inactive'),
    clicks: Number(row.clicks) || 0,
    impressions: Number(row.impressions) || 0,
    budget: row.budget ?? undefined,
    platform: row.platform ?? undefined,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<AdRow>(
      `SELECT ${AD_SELECT} FROM core.ads_engine ORDER BY created_at DESC;`
    )
    return NextResponse.json({ data: result.rows.map(mapRow) })
  } catch (err) {
    console.error('[master:ads] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب الإعلانات' }, { status: 500 })
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
    const parsed = createAdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = await withMasterTx(actor, async (tx) => {
      const result = await tx.query<AdRow>(
        `INSERT INTO core.ads_engine (campaign_name, ad_config, media_url, request_id, status, is_active)
         VALUES ($1, $2::jsonb, $3, $4, $5, $5 = 'active')
         RETURNING ${AD_SELECT};`,
        [
          parsed.data.ad_config.title,
          JSON.stringify(parsed.data.ad_config),
          parsed.data.media_url ?? null,
          parsed.data.request_id ?? null,
          parsed.data.status,
        ]
      )
      return {
        data: result.rows[0],
        audit: {
          action: 'ad.create',
          entity_type: 'ad',
          entity_id: result.rows[0].id,
          details: `إنشاء إعلان "${parsed.data.ad_config.title}"`,
          severity: 'info' as const,
        },
      }
    })

    return NextResponse.json({ data: mapRow(data) }, { status: 201 })
  } catch (err) {
    console.error('[master:ads] POST failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!pool) return dbDown()
  try {
    const actor = await resolveMasterActorFromRequest(request)
    if (!actor) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateAdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, ad_config, ...rest } = parsed.data

    const data = await withMasterTx(actor, async (tx) => {
      const existing = await tx.query<AdRow>('SELECT ad_config FROM core.ads_engine WHERE id = $1;', [id])
      if (existing.rows.length === 0) {
        throw new Error('AD_NOT_FOUND')
      }

      const mergedConfig = ad_config
        ? { ...(existing.rows[0].ad_config ?? {}), ...ad_config }
        : existing.rows[0].ad_config

      const result = await tx.query<AdRow>(
        `UPDATE core.ads_engine
         SET ad_config = $2::jsonb,
             media_url = COALESCE($3, media_url),
             status = COALESCE($4, status),
             is_active = COALESCE($4, status) = 'active',
             campaign_name = COALESCE($5, campaign_name)
         WHERE id = $1
         RETURNING ${AD_SELECT};`,
        [
          id,
          JSON.stringify(mergedConfig),
          rest.media_url ?? null,
          rest.status ?? null,
          typeof mergedConfig === 'object' && mergedConfig && 'title' in mergedConfig
            ? (mergedConfig as any).title
            : null,
        ]
      )
      return {
        data: result.rows[0],
        audit: {
          action: 'ad.update',
          entity_type: 'ad',
          entity_id: id,
          details: 'تحديث الإعلان',
          severity: 'info' as const,
        },
      }
    })

    return NextResponse.json({ data: mapRow(data) })
  } catch (err: unknown) {
    console.error('[master:ads] PATCH failed', err)
    if (err instanceof Error && err.message === 'AD_NOT_FOUND') {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
