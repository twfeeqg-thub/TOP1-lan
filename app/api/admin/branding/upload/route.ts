import { NextRequest, NextResponse } from 'next/server'
import { poolAdmin } from '@/lib/supabase-pool'
import { resolveSessionFromRequest } from '@/lib/auth-session'
import { canUploadBranding } from '@/lib/branding-gate'

export const runtime = 'nodejs'

const VALID_ASSET_TYPES = ['logo', 'favicon', 'pwa_icon'] as const
export type BrandAssetType = (typeof VALID_ASSET_TYPES)[number]

const ALLOWED_MIME: Record<BrandAssetType, string[]> = {
  logo: ['image/webp', 'image/png', 'image/jpeg'],
  favicon: ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/webp'],
  pwa_icon: ['image/png', 'image/webp'],
}

const MAX_BYTES = 1.5 * 1024 * 1024

function sanitizeTenant(tenantId: string): string {
  const safe = tenantId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  return safe || 'platform'
}

/**
 * Secure brand-asset upload.
 *
 * - Auth: service role via poolAdmin (never the anon key).
 * - Gate: super_admin always allowed; master only when `custom_upload` enabled.
 * - Writes straight into Supabase Storage `platform-assets` bucket at
 *   `branding/{tenantId}/{asset_type}.{ext}` and returns the public URL.
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
    const form = await request.formData()
    const assetTypeRaw = String(form.get('asset_type') ?? '')
    const tenantId = sanitizeTenant(String(form.get('tenant_id') ?? 'platform'))
    const file = form.get('file')

    if (!VALID_ASSET_TYPES.includes(assetTypeRaw as BrandAssetType)) {
      return NextResponse.json({ error: 'asset_type غير صالح' }, { status: 400 })
    }
    const assetType = assetTypeRaw as BrandAssetType

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'الملف مفقود' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز 1.5 MB' }, { status: 400 })
    }
    if (!ALLOWED_MIME[assetType].includes(file.type)) {
      return NextResponse.json(
        { error: `نوع الملف غير مدعوم — يُقبل: ${ALLOWED_MIME[assetType].join(', ')}` },
        { status: 400 }
      )
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp'
    const path = `branding/${tenantId}/${assetType}.${ext}`

    const { error: uploadError } = await poolAdmin.client.storage
      .from('platform-assets')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      console.error('[branding:upload] storage error', uploadError)
      return NextResponse.json({ error: 'فشل رفع الملف إلى التخزين' }, { status: 502 })
    }

    const { data: publicUrlData } = poolAdmin.client.storage
      .from('platform-assets')
      .getPublicUrl(path)

    return NextResponse.json({
      data: { url: publicUrlData.publicUrl, path },
    })
  } catch (err) {
    console.error('[branding:upload] handler error', err)
    return NextResponse.json({ error: 'تعذر معالجة الطلب' }, { status: 500 })
  }
}
