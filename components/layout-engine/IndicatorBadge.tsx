'use client'

import { cn } from '@/lib/utils'

export type IndicatorTone = 'active' | 'inactive' | 'neutral' | 'warning' | 'danger' | 'primary'

interface IndicatorBadgeProps {
  tone?: IndicatorTone
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

const toneClasses: Record<IndicatorTone, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  neutral: 'bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)] border-[var(--card-border)]',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  primary: 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]/20',
}

const dotClasses: Record<IndicatorTone, string> = {
  active: 'bg-emerald-400',
  inactive: 'bg-amber-400',
  neutral: 'bg-[var(--text-muted)]',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  primary: 'bg-[var(--primary)]',
}

/**
 * Glassmorphic status badge — a frosted pill used across the dynamic layout
 * engine to convey an entity's status (active/inactive/warning/…) without
 * breaking the Unified Design System.
 */
export function IndicatorBadge({ tone = 'neutral', children, className, pulse = false }: IndicatorBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        'bg-opacity-60 backdrop-blur-md',
        toneClasses[tone],
        className
      )}
    >
      <span className={cn('relative flex h-1.5 w-1.5 shrink-0', pulse && 'animate-pulse')}>
        <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', pulse && 'animate-ping', dotClasses[tone])} />
        <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotClasses[tone])} />
      </span>
      {children}
    </span>
  )
}
