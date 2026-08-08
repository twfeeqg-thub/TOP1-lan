import type { Ad } from './ad-types'

const PLACEMENT_LABEL: Record<string, string> = {
  top: 'أعلى',
  middle: 'وسط',
  bottom: 'أسفل',
}

const LANG_LABEL: Record<string, string> = {
  ar: 'عربية',
  en: 'إنجليزية',
}

/** UTF-8 BOM so Arabic renders correctly in Excel / WhatsApp on Windows. */
const BOM = '\uFEFF'

function csvEscape(value: string | number | undefined | null): string {
  const raw = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

function buildHeaderRow(): string[] {
  return [
    'المعرّف',
    'العنوان',
    'الوصف',
    'الرابط',
    'الموضع',
    'اللغة',
    'حالة',
    'نقرات',
    'مشاهدات',
    'الميزانية',
    'المنصة',
    'تاريخ الإنشاء',
  ]
}

function adToRow(ad: Ad): string[] {
  return [
    ad.id,
    ad.ad_config?.title ?? '',
    ad.ad_config?.description ?? '',
    ad.ad_config?.targetUrl ?? '',
    PLACEMENT_LABEL[ad.ad_config?.placement ?? ''] ?? ad.ad_config?.placement ?? '',
    LANG_LABEL[ad.ad_config?.lang ?? ''] ?? ad.ad_config?.lang ?? '',
    ad.status === 'active' ? 'نشط' : 'غير نشط',
    String(ad.clicks ?? 0),
    String(ad.impressions ?? 0),
    ad.budget ?? '',
    ad.platform ?? '',
    ad.created_at ?? '',
  ]
}

export function buildAdsCsv(ads: Ad[]): string {
  const rows = [buildHeaderRow(), ...ads.map(adToRow)]
  return BOM + rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')
}

function buildTxtLine(ad: Ad): string {
  return [
    `• ${ad.ad_config?.title ?? ad.id}`,
    `  الوصف: ${ad.ad_config?.description ?? ''}`,
    `  الرابط: ${ad.ad_config?.targetUrl ?? ''}`,
    `  الموضع: ${PLACEMENT_LABEL[ad.ad_config?.placement ?? ''] ?? ad.ad_config?.placement ?? ''} — اللغة: ${LANG_LABEL[ad.ad_config?.lang ?? ''] ?? ad.ad_config?.lang ?? ''}`,
    `  النقرات: ${ad.clicks ?? 0} — المشاهدات: ${ad.impressions ?? 0}`,
  ].join('\n')
}

export function buildAdsTxt(ads: Ad[]): string {
  const header = [
    '📊 تقرير أداء الإعلانات — منصة ذكاء سهل',
    `تاريخ التوليد: ${new Date().toLocaleString('ar')}`,
    `عدد الإعلانات: ${ads.length}`,
    '',
  ]
  const lines = ads.map(buildTxtLine)
  return BOM + [...header, ...lines].join('\n')
}

/** Client-side blob download with a proper filename. */
export function downloadBlob(name: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function waShareUrl(report: string): string {
  return `https://wa.me/?text=${encodeURIComponent(report.slice(0, 4000))}`
}

export function emailShareUrl(report: string): string {
  return `mailto:?subject=${encodeURIComponent('تقرير أداء الإعلانات')}&body=${encodeURIComponent(report)}`
}
