'use client'

import { motion } from 'motion/react'
import { GripVertical, CalendarDays } from 'lucide-react'
import { IndicatorBadge } from './IndicatorBadge'
import { PreviewButton } from './PreviewButton'
import { SovereignIcon } from '@/components/ui/sovereign-icon'
import { cn } from '@/lib/utils'

export interface ProjectControl {
  id: string
  name: string
  slug: string
  sector_name: string
  is_active: boolean
  display_order?: number | null
  modules_config?: {
    icon?: string
    name_ar?: string
    accent_color?: string
    [key: string]: unknown
  } | null
  created_at: string
}

interface ProjectControlCardProps {
  project: ProjectControl
  index: number
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ar-SA')
  } catch {
    return ''
  }
}

/**
 * Dynamic glass card for a PWA project in the master panel. Shows the dynamic
 * icon from the module config, its owning sector, status, creation date, and a
 * preview link that resolves through APP_SLUG_ROUTES.
 */
export function ProjectControlCard({ project, index }: ProjectControlCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'glass-card group relative flex flex-col gap-4 rounded-2xl p-5',
        !project.is_active && 'opacity-75'
      )}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pr-2 pl-1 text-[var(--text-muted)]/40">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors',
              'bg-[var(--primary-light)] text-[var(--primary)]'
            )}
          >
            <SovereignIcon name={project.modules_config?.icon} className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[var(--text-main)]">{project.name}</h3>
            <p className="truncate text-xs text-[var(--text-muted)] font-mono" dir="ltr">{project.slug}</p>
          </div>
        </div>
        <IndicatorBadge tone={project.is_active ? 'active' : 'danger'}>
          {project.is_active ? 'نشط' : 'متوقف'}
        </IndicatorBadge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[var(--text-muted)]/60">القطاع:</span>
          <span className="font-medium text-[var(--text-main)]">{project.sector_name}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(project.created_at)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <PreviewButton kind="project" slug={project.slug} />
      </div>
    </motion.div>
  )
}