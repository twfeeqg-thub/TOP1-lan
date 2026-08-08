'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2, RotateCw } from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { SectorCard } from '../components/sectors/SectorCard'
import { cn } from '@/lib/utils'
import { getRandomMessage, successMessages } from '@/lib/psych-support'
import type { SectorSummary } from '@/lib/sector-types'

async function fetchSectors(): Promise<{ data: SectorSummary[] }> {
  const res = await fetch('/api/master/sectors')
  if (!res.ok) throw new Error('Failed to fetch sectors')
  return res.json()
}

async function createSector(body: { name: string; slug: string; icon: string }) {
  const res = await fetch('/api/master/sectors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create sector')
  return res.json()
}

async function toggleSector(id: string, is_active: boolean) {
  const res = await fetch(`/api/master/sectors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active } as any),
  })
  if (!res.ok) throw new Error('Failed to toggle sector')
  return res.json()
}

export default function SectorsListPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newIcon, setNewIcon] = useState('FolderKanban')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['master-sectors'],
    queryFn: fetchSectors,
  })

  const createMutation = useMutation({
    mutationFn: createSector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-sectors'] })
      setCreateModalOpen(false)
      setNewName('')
      setNewSlug('')
      setNewIcon('FolderKanban')
      setSuccessMsg(getRandomMessage(successMessages))
      setTimeout(() => setSuccessMsg(null), 3000)
    },
  })

  const handleToggle = useCallback(
    (id: string, is_active: boolean) => {
      toggleSector(id, is_active).then(() => {
        queryClient.invalidateQueries({ queryKey: ['master-sectors'] })
      })
    },
    [queryClient]
  )

  const handleCreate = useCallback(() => {
    if (!newName.trim() || !newSlug.trim()) return
    createMutation.mutate({ name: newName.trim(), slug: newSlug.trim(), icon: newIcon })
  }, [newName, newSlug, newIcon, createMutation])

  const handleSlugChange = (value: string) => {
    setNewSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="glassy-toast flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-emerald-500">
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-[var(--text-main)]">إدارة القطاعات</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-card hover:border-[var(--primary)]/50 transition-all disabled:opacity-50"
          >
            <RotateCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            تحديث
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة قطاع
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-[var(--text-muted)] mb-3">تعذر تحميل القطاعات</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && data?.data?.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">لا توجد قطاعات بعد</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all mx-auto"
          >
            <Plus className="w-4 h-4" />
            إضافة أول قطاع
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && data?.data && data.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {data.data.map((sector, i) => (
            <SectorCard key={sector.id} sector={sector} index={i} onToggle={handleToggle} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <GlassModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="إضافة قطاع جديد"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">اسم القطاع</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="مثال: التعليم"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الكود (slug)</label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors dir-ltr text-left font-mono"
              placeholder="education"
              dir="ltr"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending || !newName.trim() || !newSlug.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء القطاع'}
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}
