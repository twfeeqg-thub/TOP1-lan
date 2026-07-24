import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { adsMock } from '@/lib/ads-mock-data'
import type { Ad } from '@/lib/ad-types'

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

export async function GET() {
  return NextResponse.json({ data: adsMock })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createAdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      ...parsed.data,
      clicks: 0,
      impressions: 0,
      created_at: new Date().toISOString(),
    }

    adsMock.push(newAd)
    return NextResponse.json({ data: newAd }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = updateAdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, ...updates } = parsed.data
    const index = adsMock.findIndex((a) => a.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    adsMock[index] = {
      ...adsMock[index],
      ...updates,
      ad_config: updates.ad_config
        ? { ...adsMock[index].ad_config, ...updates.ad_config }
        : adsMock[index].ad_config,
    }

    return NextResponse.json({ data: adsMock[index] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
