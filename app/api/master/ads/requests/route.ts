import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { adRequestsMock } from '@/lib/ads-mock-data'
import type { AdRequest } from '@/lib/ad-types'

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

export async function GET() {
  return NextResponse.json({ data: adRequestsMock })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const newRequest: AdRequest = {
      id: `req-${Date.now()}`,
      ...parsed.data,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    adRequestsMock.unshift(newRequest)
    return NextResponse.json({ data: newRequest }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = updateRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, status } = parsed.data
    const index = adRequestsMock.findIndex((r) => r.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    adRequestsMock[index] = {
      ...adRequestsMock[index],
      status,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ data: adRequestsMock[index] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
