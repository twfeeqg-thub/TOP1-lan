'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Users,
  FolderKanban,
  Megaphone,
  Inbox,
  Zap,
  ScrollText,
  RotateCw,
  Activity,
} from 'lucide-react'
import { StatsCard } from './components/stats-card'
import { motion } from 'motion/react'
import { AuditLogTimeline } from '@/components/audit/audit-log-timeline'
import { DynamicSectorsGrid } from '@/components/layout-engine/DynamicSectorsGrid'
import { DynamicProjectsGrid } from '@/components/layout-engine/DynamicProjectsGrid'
import type { AuditLogEntry } from '@/lib/audit-log'
import { cn } from '@/lib/utils'
import { getRandomMessage, encouragementMessages } from '@/lib/psych-support'

interface KpiStat {
  title: string
  value: string
  change: string
  up: boolean
}

const statIcons = [Users, FolderKanban, Megaphone, Inbox, Zap, ScrollText]

async function fetchStats(): Promise<KpiStat[]> {
  const res = await fetch('/api/master/stats', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch stats')
  const body = await res.json()
  return body.stats as KpiStat[]
}

async function fetchAudit(): Promise<AuditLogEntry[]> {
  const res = await fetch('/api/master/audit?limit=50', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch audit log')
  const body = await res.json()
  return body.data as AuditLogEntry[]
}

export default function MasterDashboard() {
  const [stats, setStats] = useState<KpiStat[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([])
  const [auditLoading, setAuditLoading] = useState(true)
  const [refreshEncouragement, setRefreshEncouragement] = useState(getRandomMessage(encouragementMessages))

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      setStats(await fetchStats())
      setRefreshEncouragement(getRandomMessage(encouragementMessages))
    } catch {
      setStats([])
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadAudit = useCallback(async () => {
    setAuditLoading(true)
    try {
      setAuditEntries(await fetchAudit())
    } catch {
      setAuditEntries([])
    } finally {
      setAuditLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      loadStats()
      loadAudit()
    }, 0)
    return () => clearTimeout(t)
  }, [loadStats, loadAudit])

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--primary)]" />
            نظرة عامة
          </h2>
          <p className="text-xs text-[var(--text-muted)] hidden md:block">
            {refreshEncouragement}
          </p>
          <button
            onClick={loadStats}
            disabled={statsLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-card hover:border-[var(--primary)]/50 transition-all disabled:opacity-50 touch-target"
          >
            <RotateCw className={cn('w-3.5 h-3.5', statsLoading && 'animate-spin')} />
            تحديث الإحصائيات
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              up={stat.up}
              icon={statIcons[i % statIcons.length]}
              index={i}
            />
          ))}
        </div>
        {!statsLoading && stats.length === 0 && (
          <div className="glass-card rounded-2xl p-6 text-center text-[var(--text-muted)] text-sm">
            تعذر تحميل الإحصائيات
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Log - takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--primary)]" />
              سجل التدقيق
            </h2>
            <button
              onClick={loadAudit}
              disabled={auditLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-card hover:border-[var(--primary)]/50 transition-all disabled:opacity-50 touch-target"
            >
              <RotateCw className={cn('w-3.5 h-3.5', auditLoading && 'animate-spin')} />
              تحديث السجل
            </button>
          </div>
          <AuditLogTimeline
            entries={auditEntries}
            maxEntries={50}
            onRefresh={loadAudit}
            loading={auditLoading}
          />
        </motion.div>

        {/* Recent activity & count placeholder handled by grids below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <DynamicSectorsGrid />
        </motion.div>
      </div>

      {/* Dynamic Projects Grid — live from /api/master/projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <DynamicProjectsGrid />
      </motion.div>
    </div>
  )
}
