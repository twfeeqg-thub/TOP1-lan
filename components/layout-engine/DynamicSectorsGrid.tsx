'use client'

import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Grid3x3 } from 'lucide-react'
import { SectorControlCard, type SectorControl } from './SectorControlCard'

async function fetchSectors(): Promise<{ data: SectorControl[] }> {
  const res = await fetch('/api/master/sectors')
  if (!res.ok) throw new Error('Failed to fetch sectors')
  return res.json()
}

async function toggleSector(id: string, is_active: boolean) {
  const res = await fetch(`/api/master/sectors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!res.ok) throw new Error('Failed to toggle sector')
  return res.json()
}

/**
 * Dynamic Sectors Grid — fetches live from `/api/master/sectors` (React Query
 * key `master-sectors`) and renders SectorControlCards. Realtime invalidation
 * from `useMasterRealtime` keeps it fresh without manual refresh buttons.
 */
export function DynamicSectorsGrid() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['master-sectors'],
    queryFn: fetchSectors,
  })

  const handleToggle = useCallback(
    async (id: string, is_active: boolean) => {
      try {
        await toggleSector(id, is_active)
        await queryClient.invalidateQueries({ queryKey: ['master-sectors'] })
        await queryClient.invalidateQueries({ queryKey: ['master-audit'] })
      } catch (err) {
        console.error('[dynamic-sectors] toggle failed', err)
      }
    },
    [queryClient]
  )

  const sectors = data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
          <Grid3x3 className="h-4 w-4 text-[var(--primary)]" />
          القطاعات
          <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
            {sectors.length}
          </span>
        </h2>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      )}

      {isError && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="mb-4 text-[var(--text-muted)]">تعذر تحميل القطاعات</p>
          <button
            onClick={() => refetch()}
            className="min-h-[44px] touch-target rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!isLoading && !isError && sectors.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد قطاعات بعد</p>
        </div>
      )}

      {!isLoading && !isError && sectors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {sectors.map((sector, i) => (
            <SectorControlCard key={sector.id} sector={sector} index={i} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
