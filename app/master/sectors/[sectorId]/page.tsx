'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { SectorFormWrapper } from '../../components/sectors/SectorFormWrapper'
import type { SectorData } from '@/lib/sector-types'

async function fetchSector(id: string): Promise<{ data: SectorData }> {
  const res = await fetch(`/api/master/sectors/${id}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('NOT_FOUND')
    throw new Error('Failed to fetch sector')
  }
  return res.json()
}

async function saveSector(id: string, data: SectorData) {
  const res = await fetch(`/api/master/sectors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save sector')
  return res.json()
}

export default function SectorEditPage() {
  const params = useParams()
  const router = useRouter()
  const sectorId = params.sectorId as string
  const queryClient = useQueryClient()
  const [localData, setLocalData] = useState<SectorData | null>(null)
  const [initialized, setInitialized] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['master-sector', sectorId],
    queryFn: () => fetchSector(sectorId),
    enabled: !!sectorId,
  })

  if (data && !initialized) {
    setLocalData(data.data)
    setInitialized(true)
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!localData) throw new Error('No data to save')
      return saveSector(sectorId, localData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-sector', sectorId] })
      queryClient.invalidateQueries({ queryKey: ['master-sectors'] })
    },
  })

  const handleChange = useCallback((newData: SectorData) => {
    setLocalData(newData)
  }, [])

  const handleSave = useCallback(() => {
    saveMutation.mutate()
  }, [saveMutation])

  const isNotFound = isError && error?.message === 'NOT_FOUND'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.push('/master/sectors')}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة إلى القطاعات
        </button>

        {localData && !saveMutation.isSuccess && (
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الكل'}
          </button>
        )}

        {saveMutation.isSuccess && (
          <span className="text-sm text-emerald-400 font-medium">تم الحفظ بنجاح ✓</span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--text-muted)]">جاري تحميل بيانات القطاع...</p>
        </div>
      )}

      {/* Not Found */}
      {isNotFound && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">القطاع غير موجود</p>
          <button
            onClick={() => router.push('/master/sectors')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
          >
            العودة إلى القائمة
          </button>
        </div>
      )}

      {/* Error (other than not found) */}
      {isError && !isNotFound && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">تعذر تحميل القطاع</p>
          <button
            onClick={() => router.push('/master/sectors')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
          >
            العودة إلى القائمة
          </button>
        </div>
      )}

      {/* Form */}
      {localData && !isLoading && (
        <div className="glass-card rounded-2xl p-6">
          <SectorFormWrapper data={localData} onChange={handleChange} />
        </div>
      )}
    </div>
  )
}
