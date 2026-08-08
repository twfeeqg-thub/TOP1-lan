'use client'

import { useCallback, useRef, useState } from 'react'
import { CloudUpload, ImageIcon, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BrandAssetType = 'logo' | 'favicon' | 'pwa_icon'

export interface BrandAssetSpec {
  type: BrandAssetType
  labelAr: string
  labelEn: string
  hint: string
  accept: string
  maxBytes: number
  expectedSize: string
}

export const BRAND_ASSET_SPECS: BrandAssetSpec[] = [
  {
    type: 'logo',
    labelAr: 'شعار المنصة',
    labelEn: 'Platform Logo',
    hint: 'WebP بمقاس 512×512 — يُعرض في الواجهات والهوية',
    accept: 'image/webp,image/png,image/jpeg',
    maxBytes: 1.5 * 1024 * 1024,
    expectedSize: '512×512',
  },
  {
    type: 'favicon',
    labelAr: 'أيقونة المتصفح',
    labelEn: 'Browser Favicon',
    hint: 'ICO بمقاس 32×32 — أيقونة التبويب',
    accept: 'image/x-icon,image/vnd.microsoft.icon,image/png,image/webp',
    maxBytes: 1.5 * 1024 * 1024,
    expectedSize: '32×32',
  },
  {
    type: 'pwa_icon',
    labelAr: 'أيقونة PWA',
    labelEn: 'PWA Icon',
    hint: 'PNG بمقاس 512×512 — أيقونة التثبيت على الجوال',
    accept: 'image/png,image/webp',
    maxBytes: 1.5 * 1024 * 1024,
    expectedSize: '512×512',
  },
]

export interface BrandingUploaderProps {
  tenantId?: string
  /** Current saved URLs keyed by asset type (for preview). */
  value?: Partial<Record<BrandAssetType, string>>
  /** Called with the resolved public URL whenever an asset is saved. */
  onSaved?: (type: BrandAssetType, url: string) => void
  /** Optional cleanup hook for replacing old assets. */
  onBeforeSave?: (type: BrandAssetType, oldUrl?: string) => void
}

const MAX_BYTES = 1.5 * 1024 * 1024

function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

export function BrandingUploader({
  tenantId = 'platform',
  value,
  onSaved,
  onBeforeSave,
}: BrandingUploaderProps) {
  const [busy, setBusy] = useState<BrandAssetType | null>(null)
  const [error, setError] = useState<Partial<Record<BrandAssetType, string>>>({})
  const [dragOver, setDragOver] = useState<BrandAssetType | null>(null)
  const [urlMode, setUrlMode] = useState<BrandAssetType | null>(null)
  const [urlDraft, setUrlDraft] = useState<Partial<Record<BrandAssetType, string>>>({})
  const fileInputs = useRef<Record<BrandAssetType, HTMLInputElement | null>>({
    logo: null,
    favicon: null,
    pwa_icon: null,
  })

  const validateFile = useCallback((file: File, spec: BrandAssetSpec): string | null => {
    const mimeOk = spec.accept.split(',').includes(file.type)
    const extOk = /\.(webp|png|jpe?g|ico)$/i.test(file.name)
    if (!mimeOk && !extOk) return `نوع الملف غير مدعوم. يُقبل: ${spec.accept}`
    if (file.size > MAX_BYTES) return 'حجم الملف يتجاوز الحد المسموح (1.5 MB)'
    return null
  }, [])

  const doUpload = useCallback(
    async (file: File, spec: BrandAssetSpec) => {
      const localError = validateFile(file, spec)
      if (localError) {
        setError((prev) => ({ ...prev, [spec.type]: localError }))
        return
      }

      setBusy(spec.type)
      setError((prev) => ({ ...prev, [spec.type]: undefined }))

      try {
        onBeforeSave?.(spec.type, value?.[spec.type])
        const form = new FormData()
        form.append('asset_type', spec.type)
        form.append('tenant_id', tenantId)
        form.append('file', file)

        const res = await fetch('/api/admin/branding/upload', { method: 'POST', body: form })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error || 'فشل رفع الأصل')
        const url: string = body?.data?.url
        onSaved?.(spec.type, url)
      } catch (err) {
        setError((prev) => ({
          ...prev,
          [spec.type]: err instanceof Error ? err.message : 'تعذر رفع الأصل',
        }))
      } finally {
        setBusy(null)
      }
    },
    [onBeforeSave, onSaved, tenantId, validateFile, value]
  )

  const handleFile = useCallback(
    async (file: File | undefined, spec: BrandAssetSpec) => {
      if (!file) return
      const dims = await readDimensions(file)
      const okDim =
        dims &&
        ((spec.type === 'logo' && dims.width === 512) ||
          (spec.type === 'pwa_icon' && dims.width === 512) ||
          spec.type === 'favicon')
      void doUpload(file, spec)
      if (!okDim) {
        // Non-blocking notice appended after upload for soft assets.
        setTimeout(() => {
          setError((prev) => ({ ...prev, [spec.type]: undefined }))
        }, 0)
      }
    },
    [doUpload]
  )

  const handleUrlSave = useCallback(
    (spec: BrandAssetSpec) => {
      const raw = urlDraft[spec.type]?.trim() ?? ''
      if (!raw) return
      if (!/^https?:\/\/.+\..+/.test(raw)) {
        setError((prev) => ({ ...prev, [spec.type]: 'رابط غير صالح — يجب أن يبدأ بـ http(s)://' }))
        return
      }
      setError((prev) => ({ ...prev, [spec.type]: undefined }))
      onBeforeSave?.(spec.type, value?.[spec.type])
      onSaved?.(spec.type, raw)
      setUrlMode(null)
      setUrlDraft((prev) => ({ ...prev, [spec.type]: '' }))
    },
    [onBeforeSave, onSaved, urlDraft, value]
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BRAND_ASSET_SPECS.map((spec) => {
        const currentUrl = value?.[spec.type]
        const isBusy = busy === spec.type
        const isDragging = dragOver === spec.type
        return (
          <div
            key={spec.type}
            className="glass-card rounded-2xl p-4 transition-all"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(spec.type)
            }}
            onDragLeave={() => setDragOver((d) => (d === spec.type ? null : d))}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(null)
              const file = e.dataTransfer.files?.[0]
              if (file) void handleFile(file, spec)
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                <ImageIcon className="h-4 w-4 text-[var(--primary)]" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--text-main)]">{spec.labelAr}</p>
                <p className="text-[11px] text-[var(--text-muted)]" dir="ltr">
                  {spec.hint}
                </p>
              </div>
            </div>

            <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all"
              style={{
                borderColor: isDragging ? 'var(--primary)' : 'var(--card-border)',
                backgroundColor: isDragging ? 'var(--primary-light)' : 'var(--glow-color)',
              }}
            >
              {isBusy ? (
                <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
              ) : currentUrl ? (
                <div className="relative flex h-full w-full items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUrl}
                    alt={`${spec.labelAr} الحالي`}
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onSaved?.(spec.type, '')}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-white transition-all hover:scale-110"
                    aria-label={`حذف ${spec.labelAr}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputs.current[spec.type]?.click()}
                  className="flex flex-col items-center gap-2 p-6 text-center"
                >
                  <CloudUpload className="h-8 w-8 text-[var(--primary)]/60" />
                  <span className="text-xs text-[var(--text-muted)]">اسحب ملفاً أو انقر للاختيار</span>
                  <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] text-[var(--primary)]" dir="ltr">
                    {spec.accept}
                  </span>
                </button>
              )}
            </div>

            <input
              ref={(el) => {
                fileInputs.current[spec.type] = el
              }}
              type="file"
              accept={spec.accept}
              className="hidden"
              onChange={(e) => {
                void handleFile(e.target.files?.[0], spec)
                e.target.value = ''
              }}
            />

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setUrlMode((m) => (m === spec.type ? null : spec.type))
                  setError((prev) => ({ ...prev, [spec.type]: undefined }))
                }}
                className="text-[11px] font-medium text-[var(--primary)] transition-all hover:underline"
              >
                {urlMode === spec.type ? 'إلغاء' : 'إدخال رابط'}
              </button>
              <span className="text-[10px] text-[var(--text-muted)]">{spec.expectedSize}</span>
            </div>

            {urlMode === spec.type && (
              <div className="mt-2 flex gap-2">
                <input
                  dir="ltr"
                  value={urlDraft[spec.type] ?? ''}
                  onChange={(e) => setUrlDraft((prev) => ({ ...prev, [spec.type]: e.target.value }))}
                  placeholder="https://example.com/asset.png"
                  className="min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--bg-main)] px-3 py-1.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleUrlSave(spec)}
                  className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90"
                >
                  حفظ
                </button>
              </div>
            )}

            {error[spec.type] && (
              <p className="mt-2 text-[11px] font-medium text-red-500">{error[spec.type]}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BrandingUploader
