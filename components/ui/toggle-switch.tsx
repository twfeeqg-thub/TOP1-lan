'use client'

import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

/**
 * Mobile-first toggle switch: the interactive hit area is a guaranteed
 * 44×44px touch target (WCAG / Yemeni mobile network clients guideline) while
 * the visible track keeps its compact size centered inside it.
 */
export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'تبديل'}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
          'touch-target',
          'transition-transform active:scale-95 duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]'
        )}
      >
        <span
          aria-hidden
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200',
            checked ? 'bg-[var(--primary)]' : 'bg-[var(--sidebar-hover-bg)]'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
              checked ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
            )}
          />
        </span>
      </button>
      {label && (
        <span className="text-sm text-[var(--text-main)]">{label}</span>
      )}
    </label>
  )
}
