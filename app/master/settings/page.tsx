'use client'

import { Settings as SettingsIcon, ImageIcon, ShieldCheck } from 'lucide-react'
import { RequireRole } from '../components/require-role'
import { BrandingUploader } from '@/components/admin/BrandingUploader'

export default function SettingsPage() {
  return (
    <RequireRole role={['super_admin', 'master']}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
            <SettingsIcon className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
              إعدادات المنصة
              <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                v2
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              الهوية الأساسية، أصول المنصة، ومعلومات نسخة الكاش.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[var(--primary)]" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">أصول البراندنغ</h3>
          </div>
          <BrandingUploader />
        </div>

        <div className="glass-card flex items-start gap-3 rounded-2xl p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-[var(--text-main)]">نسخة كاش التطبيق</p>
            <p className="text-xs text-[var(--text-muted)]">
              كاش الـ Service Worker الحالي: <code dir="ltr" className="font-mono">aisahl-static-v2</code>. عند رفع الإصدار تُتجاهل التخطيطات القديمة المخزنة على أجهزة الجوال تلقائياً.
            </p>
          </div>
        </div>
      </div>
    </RequireRole>
  )
}
