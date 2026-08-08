'use client'

import Link from 'next/link'
import { ExternalLink, Eye } from 'lucide-react'
import { APP_SLUG_ROUTES } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'

export type PreviewKind = 'sector' | 'project'

interface PreviewButtonProps {
  kind: PreviewKind
  slug: string
  label?: string
  className?: string
}

function resolvePreviewHref(kind: PreviewKind, slug: string): string | null {
  if (kind === 'sector') {
    // Sector landing templates live at /${slug} (app/[sector_slug]).
    return slug ? `/${slug}` : null
  }
  // PWA project previews are registered in APP_SLUG_ROUTES; a project without
  // a live route cannot be previewed.
  return APP_SLUG_ROUTES[slug] ?? null
}

/**
 * Dynamic routing previewer for the Layout Engine. Directs the super admin /
 * master directly to the public preview of a sector (`/${slug}`) or a PWA
 * project (`APP_SLUG_ROUTES[slug]`). Falls back to a disabled state when no
 * route exists.
 */
export function PreviewButton({ kind, slug, label, className }: PreviewButtonProps) {
  const href = resolvePreviewHref(kind, slug)

  if (!href) {
    return (
      <span
        className={cn(
          'inline-flex min-h-[44px] touch-target items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-medium',
          'border-[var(--card-border)] text-[var(--text-muted)]/60 cursor-not-allowed select-none',
          className
        )}
        title="لا يوجد رابط معاينة مسجّل"
      >
        <Eye className="h-4 w-4" />
        {label ?? 'لا يوجد معاينة'}
      </span>
    )
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-[44px] touch-target items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-medium transition-all',
        'glass-card hover:border-[var(--primary)] hover:text-[var(--primary)]',
        className
      )}
    >
      <ExternalLink className="h-4 w-4" />
      {label ?? 'معاينة'}
    </Link>
  )
}
