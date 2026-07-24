'use client'

import { useState, useCallback } from 'react'
import {
  Users,
  FolderKanban,
  Megaphone,
  TrendingUp,
  Zap,
  Heart,
  RotateCw,
  Activity,
} from 'lucide-react'
import { StatsCard } from './components/stats-card'
import { motion } from 'motion/react'
import { AuditLogTimeline } from '@/components/audit/audit-log-timeline'
import { auditLogMock } from '@/lib/audit-log-mock-data'
import { cn } from '@/lib/utils'

const baseStats = [
  { title: 'المستخدمون النشطون', value: '12,847', change: '+12%', up: true, icon: Users },
  { title: 'المشاريع الجارية', value: '48', change: '+3', up: true, icon: FolderKanban },
  { title: 'الإعلانات النشطة', value: '124', change: '-2%', up: false, icon: Megaphone },
  { title: 'الإيرادات الشهرية', value: '$284K', change: '+8%', up: true, icon: TrendingUp },
  { title: 'الميزات المطلوبة', value: '36', change: '+6', up: true, icon: Zap },
  { title: 'معدل الرضا', value: '94.2%', change: '+1.2%', up: true, icon: Heart },
]

const refreshVariants: Record<string, typeof baseStats[number][]> = {
  projects: [
    { title: 'المستخدمون النشطون', value: '13,021', change: '+13%', up: true, icon: Users },
    { title: 'المشاريع الجارية', value: '51', change: '+6', up: true, icon: FolderKanban },
    { title: 'الإعلانات النشطة', value: '118', change: '-5%', up: false, icon: Megaphone },
    { title: 'الإيرادات الشهرية', value: '$291K', change: '+10%', up: true, icon: TrendingUp },
    { title: 'الميزات المطلوبة', value: '42', change: '+12', up: true, icon: Zap },
    { title: 'معدل الرضا', value: '94.8%', change: '+1.8%', up: true, icon: Heart },
  ],
  ads: [
    { title: 'المستخدمون النشطون', value: '12,910', change: '+11%', up: true, icon: Users },
    { title: 'المشاريع الجارية', value: '48', change: '+3', up: true, icon: FolderKanban },
    { title: 'الإعلانات النشطة', value: '132', change: '+6%', up: true, icon: Megaphone },
    { title: 'الإيرادات الشهرية', value: '$296K', change: '+12%', up: true, icon: TrendingUp },
    { title: 'الميزات المطلوبة', value: '36', change: '+6', up: true, icon: Zap },
    { title: 'معدل الرضا', value: '94.2%', change: '+1.2%', up: true, icon: Heart },
  ],
  features: [
    { title: 'المستخدمون النشطون', value: '12,847', change: '+12%', up: true, icon: Users },
    { title: 'المشاريع الجارية', value: '49', change: '+4', up: true, icon: FolderKanban },
    { title: 'الإعلانات النشطة', value: '124', change: '-2%', up: false, icon: Megaphone },
    { title: 'الإيرادات الشهرية', value: '$284K', change: '+8%', up: true, icon: TrendingUp },
    { title: 'الميزات المطلوبة', value: '40', change: '+10', up: true, icon: Zap },
    { title: 'معدل الرضا', value: '94.5%', change: '+1.5%', up: true, icon: Heart },
  ],
}

export default function MasterDashboard() {
  const [stats, setStats] = useState(baseStats)
  const [loadingSection, setLoadingSection] = useState<string | null>(null)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditEntries, setAuditEntries] = useState(auditLogMock)

  const handleRefresh = useCallback((section: string) => {
    setLoadingSection(section)
    setTimeout(() => {
      const variant = refreshVariants[section]
      if (variant) setStats(variant)
      setLoadingSection(null)
    }, 600)
  }, [])

  const handleAuditRefresh = useCallback(() => {
    setAuditLoading(true)
    setTimeout(() => {
      setAuditEntries([...auditLogMock])
      setAuditLoading(false)
    }, 500)
  }, [])

  const refreshableSections: { key: string; label: string; icon: typeof RotateCw }[] = [
    { key: 'projects', label: 'المشاريع', icon: FolderKanban },
    { key: 'ads', label: 'الإعلانات', icon: Megaphone },
    { key: 'features', label: 'الميزات', icon: Zap },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--primary)]" />
            نظرة عامة
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {refreshableSections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => handleRefresh(sec.key)}
                disabled={loadingSection === sec.key}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  'glass-card hover:border-[var(--primary)]/50 disabled:opacity-50',
                )}
              >
                <RotateCw className={cn('w-3.5 h-3.5', loadingSection === sec.key && 'animate-spin')} />
                تحديث {sec.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <StatsCard key={stat.title} {...stat} index={i} />
          ))}
        </div>
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
              onClick={handleAuditRefresh}
              disabled={auditLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-card hover:border-[var(--primary)]/50 transition-all disabled:opacity-50"
            >
              <RotateCw className={cn('w-3.5 h-3.5', auditLoading && 'animate-spin')} />
              تحديث السجل
            </button>
          </div>
          <AuditLogTimeline
            entries={auditEntries}
            maxEntries={50}
            onRefresh={handleAuditRefresh}
            loading={auditLoading}
          />
        </motion.div>

        {/* Fastest Growing Projects - takes 1 column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[var(--text-main)]">أسرع المشاريع نمواً</h2>
            <button
              onClick={() => handleRefresh('projects')}
              disabled={loadingSection === 'projects'}
              className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover-bg)] transition-all disabled:opacity-50"
            >
              <RotateCw className={cn('w-4 h-4', loadingSection === 'projects' && 'animate-spin')} />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'المنصة التعليمية', progress: 78, color: 'bg-[var(--primary)]' },
              { name: 'نظام الصحة الإلكتروني', progress: 45, color: 'bg-emerald-500' },
              { name: 'تطبيق العقارات', progress: 92, color: 'bg-amber-500' },
              { name: 'منصة التجارة', progress: 60, color: 'bg-violet-500' },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--text-main)]">{project.name}</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--sidebar-hover-bg)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${project.color} shadow-[0_0_8px_var(--glow-color)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}