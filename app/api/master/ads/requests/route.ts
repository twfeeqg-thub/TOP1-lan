import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/supabase-pool'
import { withMasterTx, resolveMasterActorFromRequest } from '@/lib/master-tx'
import type { AdRequest } from '@/lib/ad-types'

export const runtime = 'nodejs'

const createRequestSchema = z.object({
  client_info: z.object({
    business_name: z.string().min(1, 'اسم النشاط التجاري مطلوب'),
    whatsapp: z.string().min(1, 'رقم الواتساب مطلوب'),
    target_sector: z.string().min(1, 'قطاع الاستهداف مطلوب'),
  }),
  campaign: z.object({
    start_date: z.string().min(1, 'تاريخ البدء مطلوب'),
    end_date: z.string().min(1, 'تاريخ الانتهاء مطلوب'),
    package: z.enum(['standard', 'exclusive', 'video']),
  }),
  attachments: z.object({
    card_url: z.string().optional(),
    payment_proof_url: z.string().optional(),
  }).optional().default({}),
  design_request: z.object({
    marketing_text: z.string().optional(),
    logo_url: z.string().optional(),
    preferred_colors: z.string().optional(),
    cta_type: z.enum(['visit', 'call', 'whatsapp', 'subscribe']).optional(),
  }).optional(),
})

const updateRequestSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['approved', 'rejected']),
})

interface RequestRow {
  id: string
  client_info: any
  campaign: any
  attachments: any
  design_request: any
  status: string
  created_at: Date
  updated_at: Date | null
}

const REQUEST_SELECT = `id, client_info, campaign, attachments, design_request, status, created_at, updated_at`

function mapRow(row: RequestRow): AdRequest {
  return {
    id: row.id,
    client_info: row.client_info,
    campaign: row.campaign,
    attachments: row.attachments ?? {},
    design_request: row.design_request ?? undefined,
    status: row.status as AdRequest['status'],
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updated_at: row.updated_at
      ? (row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at))
      : undefined,
  }
}

function dbDown() {
  return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 })
}

export async function GET() {
  if (!pool) return dbDown()
  try {
    const result = await pool.query<RequestRow>(
      `SELECT ${REQUEST_SELECT} FROM core.ad_requests ORDER BY created_at DESC;`
    )
    return NextResponse.json({ data: result.rows.map(mapRow) })
  } catch (err) {
    console.error('[master:ad-requests] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب الطلبات' }, { status: 500 })
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
    const parsed = createRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const id = `req-${Date.now()}`
    const data = await withMasterTx(actor, async (tx) => {
      const result = await tx.query<RequestRow>(
        `INSERT INTO core.ad_requests (id, client_info, campaign, attachments, design_request, status)
         VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, 'pending')
         RETURNING ${REQUEST_SELECT};`,
        [
          id,
          JSON.stringify(parsed.data.client_info),
          JSON.stringify(parsed.data.campaign),
          JSON.stringify(parsed.data.attachments),
          parsed.data.design_request ? JSON.stringify(parsed.data.design_request) : null,
        ]
      )
      return {
        data: result.rows[0],
        audit: {
          action: 'ad_request.create',
          entity_type: 'ad_request',
          entity_id: id,
          details: `تسجيل طلب إعلان "${parsed.data.client_info.business_name}"`,
          severity: 'info' as const,
        },
      }
    })

    return NextResponse.json({ data: mapRow(data) }, { status: 201 })
  } catch (err) {
    console.error('[master:ad-requests] POST failed', err)
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
    const parsed = updateRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = await withMasterTx(actor, async (tx) => {
      const result = await tx.query<RequestRow>(
        `UPDATE core.ad_requests SET status = $2, updated_at = now()
         WHERE id = $1
         RETURNING ${REQUEST_SELECT};`,
        [parsed.data.id, parsed.data.status]
      )
      if (result.rows.length === 0) {
        throw new Error('REQUEST_NOT_FOUND')
      }
      return {
        data: result.rows[0],
        audit: {
          action: 'ad_request.review',
          entity_type: 'ad_request',
          entity_id: parsed.data.id,
          details: parsed.data.status === 'approved' ? 'الموافقة على طلب إعلان' : 'رفض طلب إعلان',
          severity: parsed.data.status === 'approved' ? ('info' as const) : ('medium' as const),
        },
      }
    })

    return NextResponse.json({ data: mapRow(data) })
  } catch (err: unknown) {
    console.error('[master:ad-requests] PATCH failed', err)
    if (err instanceof Error && err.message === 'REQUEST_NOT_FOUND') {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
