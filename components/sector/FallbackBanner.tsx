'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useHasHydrated, useLocalStorageValue } from '@/hooks/use-local-storage'

const DISMISS_KEY = 'fallback-banner-dismissed'
const DISMISS_DURATION = 5 * 60 * 1000

function isDismissed(dismissedAt: string | null): boolean {
  if (!dismissedAt) return false
  return Date.now() - Number(dismissedAt) < DISMISS_DURATION
}

export default function FallbackBanner() {
  const hydrated = useHasHydrated()
  const [dismissedAt, setDismissedAt] = useLocalStorageValue<string | null>(DISMISS_KEY, {
    fallback: null,
    read: (raw) => raw,
    serialize: (value) => value ?? '',
  })

  const visible = hydrated && !isDismissed(dismissedAt)

  const handleDismiss = () => {
    setDismissedAt(String(Date.now()))
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-full max-w-2xl px-4 animate-in slide-in-from-top-2 fade-in duration-300"
      role="alert"
    >
      <div
        className="relative flex items-start gap-3 p-4 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-main, #0f172a) 85%, #d97706)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>

        <p
          className="flex-1 text-sm font-semibold leading-relaxed"
          style={{ color: 'var(--text-muted, #94a3b8)' }}
        >
          تنبيه: تعذر الاتصال بقاعدة البيانات، يتم الآن عرض بيانات وهمية للمعاينة
        </p>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-muted, #94a3b8)' }} />
        </button>
      </div>
    </div>
  )
}
