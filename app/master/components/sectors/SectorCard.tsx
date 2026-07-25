'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, HeartPulse, Building2, ShoppingCart, FolderKanban,
} from 'lucide-react'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'
import type { SectorSummary } from '@/lib/sector-types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, HeartPulse, Building2, ShoppingCart, FolderKanban,
}

interface SectorCardProps {
  sector: SectorSummary
  index: number
  onToggle: (id: string, checked: boolean) => void
}

export function SectorCard({ sector, index, onToggle }: SectorCardProps) {
  const router = useRouter()
  const Icon = iconMap[sector.icon] || FolderKanban

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'glass-card rounded-2xl p-5 group transition-all',
        !sector.is_active && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
            sector.is_active
              ? 'bg-[var(--primary-light)] group-hover:bg-[var(--sidebar-active-bg)]'
              : 'bg-[var(--sidebar-hover-bg)]'
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              sector.is_active ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
            )}
          />
        </div>
        <ToggleSwitch
          checked={sector.is_active}
          onChange={(checked) => onToggle(sector.id, checked)}
        />
      </div>
      <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">{sector.name}</h3>
      <p className="text-xs text-[var(--text-muted)] font-mono mb-4 dir-ltr text-left">{sector.slug}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(`/master/sectors/${sector.id}`)}
          className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
        >
          تحرير القطاع
        </button>
      </div>
    </motion.div>
  )
}
