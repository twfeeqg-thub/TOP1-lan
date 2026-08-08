import { NextRequest, NextResponse } from 'next/server'
import { resolveSessionFromRequest } from '@/lib/auth-session'
import { canUploadBranding } from '@/lib/branding-gate'

export const runtime = 'nodejs'

const VALID_ASSET_TYPES = ['logo', 'favicon', 'pwa_icon'] as const
export type BrandAssetType = (typeof VALID_ASSET_TYPES)[number]

function sanitizeTenant(tenantId: string): string {
  const safe = tenantId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  return safe || 'platform'
}

/**
 * Validates & persists an externally-hosted branding URL selection.
 *
 * The public URL itself is stored by the caller into the workspace config
 * (`logo_url` / `favicon_url` / `pwa_icon_url`); this route only validates the
 * selection and answers a normalized pointer for the tenant. Never touches the
 * anon key and never throws a 500 on client misuse.
 */
export async function POST(request: NextRequest) {
  const session = await resolveSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const gate = canUploadBranding({ role: session.user.role })
  if (!gate) {
    return NextResponse.json(
      { error: 'رفع البراندنغ غير مفعّل لهذه الطبقة' },
      { status: 403 }
    )
  }

  try {
    const body = (await request.json()) as {
      asset_type?: string
      tenant_id?: string
      url?: string
    }

    const assetType = body.asset_type
    if (!VALID_ASSET_TYPES.includes(assetType as BrandAssetType)) {
      return NextResponse.json({ error: 'asset_type غير صالح' }, { status: 400 })
    }

    const tenantId = sanitizeTenant(body.tenant_id ?? 'platform')
    const url = (body.url ?? '').trim()
    if (url && !/^https?:\/\/.+\..+/.test(url)) {
      return NextResponse.json({ error: 'رابط غير صالح' }, { status: 400 })
    }

    return NextResponse.json({ data: { tenant_id: tenantId, asset_type: assetType, url: url || null } })
  } catch {
    return NextResponse.json({ error: 'تعذر معالجة الطلب' }, { status: 400 })
  }
}
