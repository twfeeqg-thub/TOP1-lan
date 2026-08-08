'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Pencil, GripVertical } from 'lucide-react'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { IndicatorBadge } from './IndicatorBadge'
import { PreviewButton } from './PreviewButton'
import { SovereignIcon } from '@/components/ui/sovereign-icon'
import { cn } from '@/lib/utils'

export interface SectorControl {
  id: string
  name: string
  slug: string
  icon?: string | null
  description?: string | null
  is_active: boolean
  display_order?: number | null
}

interface SectorControlCardProps {
  sector: SectorControl
  index: number
  onToggle: (id: string, checked: boolean) => void
}

/**
 * Dynamic glass card for a sector in the master panel. Carries the resolved
 * dynamic icon, a short description, an active/inactive indicator, live toggle
 * trigger, and preview/edit links.
 */
export function SectorControlCard({ sector, index, onToggle }: SectorControlCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'glass-card group relative flex flex-col gap-4 rounded-2xl p-5',
        !sector.is_active && 'opacity-75'
      )}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pr-2 pl-1 text-[var(--text-muted)]/40">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-colors touch-target',
              sector.is_active
                ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                : 'bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)]'
            )}
          >
            <SovereignIcon name={sector.icon} className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[var(--text-main)]">{sector.name}</h3>
            <p className="truncate text-xs text-[var(--text-muted)] font-mono" dir="ltr">{sector.slug}</p>
          </div>
        </div>
        <ToggleSwitch checked={sector.is_active} onChange={(c) => onToggle(sector.id, c)} />
      </div>

      {sector.description ? (
        <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{sector.description}</p>
      ) : (
        <p className="text-sm text-[var(--text-muted)]/50">لا يوجد وصف لهذا القطاع بعد</p>
      )}

      <div className="flex items-center justify-between">
        <IndicatorBadge tone={sector.is_active ? 'active' : 'inactive'} pulse={sector.is_active}>
          {sector.is_active ? 'نشط' : 'متوقف'}
        </IndicatorBadge>
        <div className="flex flex-wrap items-center gap-2">
          <PreviewButton kind="sector" slug={sector.slug} />
          <Link
            href={`/master/sectors/${sector.id}`}
            className="inline-flex min-h-[44px] touch-target items-center justify-center gap-1.5 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
          >
            <Pencil className="h-4 w-4" />
            تحرير القطاع
          </Link>
        </div>
      </div>
      <span className="sr-only">{sector.display_order ?? 0}</span>
    </motion.div>
  )
}