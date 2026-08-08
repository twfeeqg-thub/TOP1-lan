'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ChevronLeft, ChevronRight, RotateCw, Clock, Shield, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type AuditLogEntry,
  type AuditSeverity,
  severityLabels,
  getSeverityColor,
  getSeverityGlow,
  getTargetTypeLabel,
  getTargetTypeColor,
} from '@/lib/audit-log'
import { getRandomMessage, emptyMessages } from '@/lib/psych-support'

interface AuditLogTimelineProps {
  entries: AuditLogEntry[]
  maxEntries?: number
  onRefresh?: () => void
  loading?: boolean
}

const filterTypeOptions = [
  { value: 'sector', label: 'قطاعات' },
  { value: 'project', label: 'مشاريع' },
  { value: 'project_override', label: 'تخصيصات' },
  { value: 'feature', label: 'ميزات' },
  { value: 'ad', label: 'إعلانات' },
  { value: 'ad_request', label: 'طلبات إعلان' },
  { value: 'kill_switch', label: 'إيقاف الطوارئ' },
  { value: 'outbox', label: 'عمليات مؤجلة' },
]

export function AuditLogTimeline({ entries, maxEntries = 50, onRefresh, loading }: AuditLogTimelineProps) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string | 'all'>('all')
  const [filterSeverity, setFilterSeverity] = useState<AuditSeverity | 'all'>('all')
  const [page, setPage] = useState(0)
  const pageSize = 10
  const emptyMsg = useMemo(() => getRandomMessage(emptyMessages), [])

  const filtered = useMemo(() => {
    let result = entries
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.action.includes(q) ||
          e.actor.includes(q) ||
          (e.target_name && e.target_name.includes(q)) ||
          (e.details && e.details.includes(q))
      )
    }
    if (filterType !== 'all') result = result.filter((e) => e.target_type === filterType)
    if (filterSeverity !== 'all') result = result.filter((e) => e.severity === filterSeverity)
    return result
  }, [entries, search, filterType, filterSeverity])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.min(page, Math.max(0, totalPages - 1))
  const paged = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  function formatDate(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'الآن'
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `منذ ${diffHour} ساعة`
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 7) return `منذ ${diffDay} يوم`
    return d.toLocaleDateString('ar-SA')
  }

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="بحث في السجل..."
            className="glass-input touch-target w-full rounded-xl pr-10 pl-4 min-h-[44px] text-sm outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(0) }}
          className="glass-input touch-target rounded-xl px-3 min-h-[44px] min-w-[44px] text-sm outline-none appearance-none cursor-pointer"
        >
          <option value="all">جميع الأنواع</option>
          {filterTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => { setFilterSeverity(e.target.value as AuditSeverity | 'all'); setPage(0) }}
          className="glass-input touch-target rounded-xl px-3 min-h-[44px] min-w-[44px] text-sm outline-none appearance-none cursor-pointer"
        >
          <option value="all">جميع المستويات</option>
          <option value="info">{severityLabels.info}</option>
          <option value="medium">{severityLabels.medium}</option>
          <option value="high">{severityLabels.high}</option>
        </select>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 min-h-[44px] rounded-xl text-sm font-medium glass-card touch-target hover:border-[var(--primary)] transition-all disabled:opacity-50"
          >
            <RotateCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            تحديث
          </button>
        )}
      </div>

      {/* timeline */}
      <div className="relative">
        {/* vertical connector line */}
        <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[var(--primary)] via-[var(--primary)]/50 to-transparent rounded-full" />

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {paged.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-2 py-12 text-center text-[var(--text-muted)] text-sm"
              >
                <Activity className="w-8 h-8 text-[var(--text-muted)]/50" />
                {emptyMsg}
              </motion.div>
            )}
            {paged.map((entry, i) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: i * 0.04 }}
                className="flex gap-4 group"
              >
                {/* severity dot */}
                <div className="relative shrink-0 pt-1.5">
                  <div
                    className={cn(
                      'w-[26px] h-[26px] rounded-full flex items-center justify-center ring-4 ring-[var(--card-bg)]',
                      getSeverityColor(entry.severity),
                      getSeverityGlow(entry.severity),
                    )}
                  >
                    <span className="text-[10px] text-white font-bold">
                      {entry.severity === 'high' ? '✕' : entry.severity === 'medium' ? '!' : 'i'}
                    </span>
                  </div>
                </div>

                {/* card */}
                <div className="flex-1 glass-card rounded-xl p-4 transition-all group-hover:border-[var(--primary)]/30 group-hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--text-main)]">{entry.action}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', getTargetTypeColor(entry.target_type))}>
                          {getTargetTypeLabel(entry.target_type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {entry.actor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(entry.timestamp)}
                        </span>
                        {entry.details && (
                          <span className="text-[var(--text-muted)]/70 truncate max-w-[200px]">
                            {entry.details}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[var(--text-muted)]">
            صفحة {safePage + 1} من {totalPages} ({filtered.length} سجل)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg glass-card touch-target hover:border-[var(--primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg glass-card touch-target hover:border-[var(--primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
