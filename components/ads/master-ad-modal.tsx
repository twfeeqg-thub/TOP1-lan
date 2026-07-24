'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Loader2, Save } from 'lucide-react'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'
import type { Ad, AdDisplaySpace, AdPlacement, AdLang, CtaType, AdRequest } from '@/lib/ad-types'

interface MasterAdModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: AdFormData) => Promise<void>
  ad?: Ad | null
  request?: AdRequest | null
}

export interface AdFormData {
  title: string
  description: string
  targetUrl: string
  placement: AdPlacement
  display_space: AdDisplaySpace
  lang: AdLang
  is_exclusive: boolean
  is_fixed: boolean
  cta_type?: CtaType
  media_url?: string
  status: 'active' | 'inactive'
}

const placements: { value: AdPlacement; label: string }[] = [
  { value: 'top', label: 'أعلى الصفحة' },
  { value: 'middle', label: 'وسط الصفحة' },
  { value: 'bottom', label: 'أسفل الصفحة' },
]

const displaySpaces: { value: AdDisplaySpace; label: string; desc: string }[] = [
  { value: 'Login', label: 'Login', desc: 'شاشة تسجيل الدخول' },
  { value: 'Full_Screen', label: 'Full Screen', desc: 'شاشة كاملة' },
  { value: 'Banner', label: 'Banner', desc: 'بانر علوي/سفلي' },
  { value: 'Native', label: 'Native', desc: 'مدمج مع المحتوى' },
]

const ctaOptions: { value: CtaType; label: string }[] = [
  { value: 'visit', label: 'زيارة الموقع' },
  { value: 'call', label: 'اتصال هاتفي' },
  { value: 'whatsapp', label: 'واتساب' },
  { value: 'subscribe', label: 'اشتراك' },
]

export function MasterAdModal({ open, onClose, onSave, ad, request }: MasterAdModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<AdFormData>({
    title: '',
    description: '',
    targetUrl: '',
    placement: 'top',
    display_space: 'Banner',
    lang: 'ar',
    is_exclusive: false,
    is_fixed: false,
    cta_type: undefined,
    media_url: '',
    status: 'active',
  })

  useEffect(() => {
    if (ad) {
      setForm({
        title: ad.ad_config.title,
        description: ad.ad_config.description,
        targetUrl: ad.ad_config.targetUrl,
        placement: ad.ad_config.placement,
        display_space: ad.ad_config.display_space,
        lang: ad.ad_config.lang,
        is_exclusive: ad.ad_config.is_exclusive,
        is_fixed: ad.ad_config.is_fixed,
        cta_type: ad.ad_config.cta_type,
        media_url: ad.media_url || '',
        status: ad.status,
      })
    } else if (request) {
      setForm({
        title: request.client_info.business_name,
        description: request.design_request?.marketing_text || '',
        targetUrl: '',
        placement: 'top',
        display_space: 'Banner',
        lang: 'ar',
        is_exclusive: request.campaign.package === 'exclusive',
        is_fixed: request.campaign.package === 'exclusive',
        cta_type: request.design_request?.cta_type,
        media_url: request.attachments.card_url || '',
        status: 'active',
      })
    } else {
      setForm({
        title: '',
        description: '',
        targetUrl: '',
        placement: 'top',
        display_space: 'Banner',
        lang: 'ar',
        is_exclusive: false,
        is_fixed: false,
        cta_type: undefined,
        media_url: '',
        status: 'active',
      })
    }
  }, [ad, request, open])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!form.title || !form.description || !form.targetUrl) {
        setError('يرجى ملء جميع الحقول المطلوبة')
        return
      }

      setLoading(true)
      try {
        await onSave(form)
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ')
      } finally {
        setLoading(false)
      }
    },
    [form, onSave, onClose]
  )

  const isEdit = Boolean(ad)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-modal shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b border-[var(--glass-border)] bg-[var(--card-bg)] backdrop-blur-md">
              <h2 className="text-lg font-bold text-[var(--text-main)]">
                {isEdit ? 'تحرير الإعلان' : request ? 'موافقة على طلب إعلان' : 'إضافة إعلان جديد'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {request && !isEdit && (
              <div className="px-6 pt-4 pb-2">
                <div className="glass-card rounded-xl p-3 text-sm space-y-1">
                  <p><span className="text-[var(--text-muted)]">العميل:</span> {request.client_info.business_name}</p>
                  <p><span className="text-[var(--text-muted)]">واتساب:</span> {request.client_info.whatsapp}</p>
                  <p><span className="text-[var(--text-muted)]">الباقة:</span> {request.campaign.package === 'exclusive' ? 'حصري' : request.campaign.package === 'video' ? 'فيديو' : 'قياسي'}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                  محتوى الإعلان
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">عنوان الإعلان *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="مثال: تخفيضات رمضان"
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الوصف *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="وصف الإعلان..."
                      rows={3}
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">رابط الهدف *</label>
                    <input
                      type="url"
                      value={form.targetUrl}
                      onChange={(e) => setForm((p) => ({ ...p, targetUrl: e.target.value }))}
                      placeholder="https://example.com"
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">رابط الوسائط (صورة/فيديو)</label>
                    <input
                      type="url"
                      value={form.media_url || ''}
                      onChange={(e) => setForm((p) => ({ ...p, media_url: e.target.value }))}
                      placeholder="https://example.com/image.webp"
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                  مفاتيح JSONB - إعدادات العرض
                </h3>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">مساحة العرض (Display Space)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {displaySpaces.map((ds) => (
                      <button
                        type="button"
                        key={ds.value}
                        onClick={() => setForm((p) => ({ ...p, display_space: ds.value }))}
                        className={cn(
                          'rounded-xl p-3 text-center border transition-all',
                          form.display_space === ds.value
                            ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                            : 'border-[var(--card-border)] bg-[var(--input-bg)] hover:border-[var(--primary)]/50'
                        )}
                      >
                        <span className="block text-xs font-semibold text-[var(--text-main)]">{ds.label}</span>
                        <span className="block text-[10px] text-[var(--text-muted)] mt-0.5">{ds.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">موضع الصفحة (Placement)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {placements.map((p) => (
                      <button
                        type="button"
                        key={p.value}
                        onClick={() => setForm((prev) => ({ ...prev, placement: p.value }))}
                        className={cn(
                          'rounded-xl p-2.5 text-center border transition-all text-sm',
                          form.placement === p.value
                            ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                            : 'border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-muted)] hover:border-[var(--primary)]/50'
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">اللغة</label>
                    <select
                      value={form.lang}
                      onChange={(e) => setForm((p) => ({ ...p, lang: e.target.value as AdLang }))}
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">نوع CTA</label>
                    <select
                      value={form.cta_type || ''}
                      onChange={(e) => setForm((p) => ({ ...p, cta_type: (e.target.value || undefined) as CtaType | undefined }))}
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none"
                    >
                      <option value="">بدون CTA</option>
                      {ctaOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-[var(--sidebar-border)] pt-4 space-y-4">
                  <h4 className="text-xs font-semibold text-[var(--text-muted)] tracking-wider">التحكم في الظهور</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleSwitch
                      checked={form.is_exclusive}
                      onChange={(checked) => setForm((p) => ({ ...p, is_exclusive: checked }))}
                      label="حصرية الظهور (is_exclusive)"
                    />
                    <ToggleSwitch
                      checked={form.is_fixed}
                      onChange={(checked) => setForm((p) => ({ ...p, is_fixed: checked }))}
                      label="تثبيت بصري (is_fixed)"
                    />
                  </div>
                  {form.is_exclusive && (
                    <p className="text-xs text-amber-400">
                      تنبيه: الإعلان الحصري يكسر طابور العرض وسيظهر بشكل منفرد.
                    </p>
                  )}
                </div>

                <div className="border-t border-[var(--sidebar-border)] pt-4">
                  <div className="flex items-center gap-3">
                    <label className="block text-sm font-medium text-[var(--text-muted)]">حالة الإعلان</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}
                      className="glass-input rounded-xl px-3 py-1.5 text-sm outline-none appearance-none"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">متوقف</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  {loading ? 'جاري الحفظ...' : isEdit ? 'تحديث الإعلان' : 'نشر الإعلان'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
