'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  up: boolean
  icon: LucideIcon
  index?: number
}

export function StatsCard({ title, value, change, up, icon: Icon, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="glass-card rounded-2xl p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center group-hover:bg-[var(--sidebar-active-bg)] transition-colors duration-300">
          <Icon className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}
        >
          {up ? '↑' : '↓'} {change}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1">{value}</p>
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
    </motion.div>
  )
}
