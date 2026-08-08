'use client'

import { useState, useCallback, useRef, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, Upload, ImageIcon, FileText, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdPackage, CtaType } from '@/lib/ad-types'

interface ClientAdRequestModalProps {
  open: boolean
  onClose: () => void
}

const sectors = ['التعليم', 'الصحة', 'العقارات', 'التجارة', 'الزراعة', 'السياحة', 'النقل', 'الضيافة']

const packageLabels: Record<AdPackage, { label: string; desc: string }> = {
  standard: { label: 'قياسي', desc: 'ظهور عادي في المساحات المخصصة' },
  exclusive: { label: 'حصري وثابت', desc: 'ظهور حصري ومثبت بصرياً' },
  video: { label: 'فيديو قصير', desc: 'إعلان فيديو تفاعلي قصير' },
}

const ctaOptions: { value: CtaType; label: string }[] = [
  { value: 'visit', label: 'زيارة الموقع' },
  { value: 'call', label: 'اتصال هاتفي' },
  { value: 'whatsapp', label: 'واتساب' },
  { value: 'subscribe', label: 'اشتراك' },
]

function validateFile(file: File): string | null {
  const allowed = ['image/webp', 'image/png']
  if (!allowed.includes(file.type)) {
    return 'يُرجى رفع ملف WebP أو PNG فقط'
  }
  if (file.size > 150 * 1024) {
    return 'حجم الملف يتجاوز 150 كيلوبايت'
  }
  return null
}

export function ClientAdRequestModal({ open, onClose }: ClientAdRequestModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [showDesign, setShowDesign] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    business_name: '',
    whatsapp: '',
    target_sector: '',
    start_date: '',
    end_date: '',
    package: 'standard' as AdPackage,
    marketing_text: '',
    preferred_colors: '',
    cta_type: '' as CtaType | '',
  })

  const [cardFile, setCardFile] = useState<File | null>(null)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [cardPreview, setCardPreview] = useState<string | null>(null)
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null)
  const [cardError, setCardError] = useState('')
  const [paymentError, setPaymentError] = useState('')

  const cardInputRef = useRef<HTMLInputElement>(null)
  const paymentInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>, type: 'card' | 'payment') => {
      const file = e.target.files?.[0]
      if (!file) return

      const err = validateFile(file)
      if (err) {
        if (type === 'card') setCardError(err)
        else setPaymentError(err)
        return
      }

      if (type === 'card') {
        setCardError('')
        setCardFile(file)
        setCardPreview(URL.createObjectURL(file))
      } else {
        setPaymentError('')
        setPaymentFile(file)
        setPaymentPreview(URL.createObjectURL(file))
      }
    },
    []
  )

  const removeFile = useCallback((type: 'card' | 'payment') => {
    if (type === 'card') {
      setCardFile(null)
      setCardPreview(null)
      setCardError('')
    } else {
      setPaymentFile(null)
      setPaymentPreview(null)
      setPaymentError('')
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!form.business_name || !form.whatsapp || !form.target_sector || !form.start_date || !form.end_date) {
        setError('يرجى ملء جميع الحقول المطلوبة')
        return
      }

      setLoading(true)

      await new Promise((r) => setTimeout(r, 800))
      setLoading(false)
      setStep('success')
    },
    [form]
  )

  const handleClose = useCallback(() => {
    setStep('form')
    setShowDesign(false)
    setError('')
    setCardFile(null)
    setPaymentFile(null)
    setCardPreview(null)
    setPaymentPreview(null)
    setCardError('')
    setPaymentError('')
    setForm({
      business_name: '',
      whatsapp: '',
      target_sector: '',
      start_date: '',
      end_date: '',
      package: 'standard',
      marketing_text: '',
      preferred_colors: '',
      cta_type: '',
    })
    onClose()
  }, [onClose])

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
            onClick={handleClose}
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
                {step === 'success' ? 'تم إرسال الطلب' : 'طلب إعلان جديد'}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'success' ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">تم استلام طلبك بنجاح</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                  سنقوم بمراجعة طلب إعلانك والتواصل معك عبر الواتساب قريباً. شكراً لثقتك!
                </p>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
                >
                  حسناً
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                    بيانات الهوية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                        اسم النشاط التجاري *
                      </label>
                      <input
                        type="text"
                        value={form.business_name}
                        onChange={(e) => setForm((p) => ({ ...p, business_name: e.target.value }))}
                        placeholder="مثال: مؤسسة النور"
                        className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                        رقم الواتساب *
                      </label>
                      <input
                        type="text"
                        value={form.whatsapp}
                        onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                        placeholder="مثال: 967777111222"
                        className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                        dir="ltr"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                        قطاع الاستهداف *
                      </label>
                      <select
                        value={form.target_sector}
                        onChange={(e) => setForm((p) => ({ ...p, target_sector: e.target.value }))}
                        className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none"
                      >
                        <option value="">اختر القطاع</option>
                        {sectors.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                    بيانات الحملة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">تاريخ البدء *</label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                        className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">تاريخ الانتهاء *</label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                        className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">نوع الباقة *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(Object.entries(packageLabels) as [AdPackage, typeof packageLabels[AdPackage]][]).map(
                          ([key, val]) => (
                            <button
                              type="button"
                              key={key}
                              onClick={() => setForm((p) => ({ ...p, package: key }))}
                              className={cn(
                                'rounded-xl p-3 text-right border transition-all text-sm',
                                form.package === key
                                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                                  : 'border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-muted)] hover:border-[var(--primary)]/50'
                              )}
                            >
                              <span className="block font-semibold">{val.label}</span>
                              <span className="block text-xs mt-0.5 opacity-75">{val.desc}</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                    المرفقات
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                        الكارت الإعلاني
                      </label>
                      <input
                        ref={cardInputRef}
                        type="file"
                        accept=".webp,.png"
                        onChange={(e) => handleFileSelect(e, 'card')}
                        className="hidden"
                      />
                      {cardPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-[var(--card-border)]">
                          <Image src={cardPreview} alt="Card preview" width={640} height={112} sizes="(max-width: 768px) 100vw, 640px" loading="lazy" decoding="async" unoptimized className="w-full h-28 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile('card')}
                            className="absolute top-1 right-1 p-1 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => cardInputRef.current?.click()}
                          className={cn(
                            'w-full rounded-xl border-2 border-dashed p-4 text-center transition-all',
                            cardError
                              ? 'border-red-500/50 bg-red-500/5'
                              : 'border-[var(--card-border)] hover:border-[var(--primary)]/50 bg-[var(--input-bg)]'
                          )}
                        >
                          <ImageIcon className="w-5 h-5 mx-auto mb-1 text-[var(--text-muted)]" />
                          <span className="text-xs text-[var(--text-muted)]">WebP / PNG</span>
                          <span className="block text-[10px] text-[var(--text-muted)]/60">بحد أقصى 150 كيلوبايت</span>
                        </button>
                      )}
                      {cardError && <p className="mt-1 text-xs text-red-500">{cardError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                        سند السداد المحلي
                      </label>
                      <input
                        ref={paymentInputRef}
                        type="file"
                        accept=".webp,.png"
                        onChange={(e) => handleFileSelect(e, 'payment')}
                        className="hidden"
                      />
                      {paymentPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-[var(--card-border)]">
                          <Image src={paymentPreview} alt="Payment proof" width={640} height={112} sizes="(max-width: 768px) 100vw, 640px" loading="lazy" decoding="async" unoptimized className="w-full h-28 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile('payment')}
                            className="absolute top-1 right-1 p-1 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => paymentInputRef.current?.click()}
                          className={cn(
                            'w-full rounded-xl border-2 border-dashed p-4 text-center transition-all',
                            paymentError
                              ? 'border-red-500/50 bg-red-500/5'
                              : 'border-[var(--card-border)] hover:border-[var(--primary)]/50 bg-[var(--input-bg)]'
                          )}
                        >
                          <FileText className="w-5 h-5 mx-auto mb-1 text-[var(--text-muted)]" />
                          <span className="text-xs text-[var(--text-muted)]">WebP / PNG</span>
                          <span className="block text-[10px] text-[var(--text-muted)]/60">بحد أقصى 150 كيلوبايت</span>
                        </button>
                      )}
                      {paymentError && <p className="mt-1 text-xs text-red-500">{paymentError}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowDesign(!showDesign)}
                    className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                  >
                    <span className={cn('transition-transform', showDesign && 'rotate-45')}>+</span>
                    {showDesign ? 'إخفاء قسم طلب التصميم' : 'إضافة طلب تصميم (اختياري)'}
                  </button>

                  {showDesign && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                            النص التسويقي
                          </label>
                          <textarea
                            value={form.marketing_text}
                            onChange={(e) => setForm((p) => ({ ...p, marketing_text: e.target.value }))}
                            placeholder="اكتب النص الذي ترغب في ظهوره في الإعلان..."
                            rows={3}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                            الألوان المفضلة
                          </label>
                          <input
                            type="text"
                            value={form.preferred_colors}
                            onChange={(e) => setForm((p) => ({ ...p, preferred_colors: e.target.value }))}
                            placeholder="#2563EB, #FFFFFF"
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                            نوع زر الإجراء (CTA)
                          </label>
                          <select
                            value={form.cta_type}
                            onChange={(e) => setForm((p) => ({ ...p, cta_type: e.target.value as CtaType }))}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none"
                          >
                            <option value="">اختر نوع CTA</option>
                            {ctaOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
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
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
