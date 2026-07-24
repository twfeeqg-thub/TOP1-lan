'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Zap,
  Shield,
  BarChart3,
  Globe,
  Lock,
  Smartphone,
  School,
  Loader2,
  Check,
} from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof Zap> = {
  Zap,
  Shield,
  BarChart3,
  Globe,
  Lock,
  Smartphone,
}

interface Feature {
  id: string
  name: string
  description: string
  slug: string
  is_active: boolean
  icon: string
  priority: string
  enabled_schools: number[]
}

interface School {
  id: number
  name: string
}

async function fetchFeatures(): Promise<{ data: Feature[]; schools: School[] }> {
  const res = await fetch('/api/master/features')
  if (!res.ok) throw new Error('Failed to fetch features')
  return res.json()
}

async function toggleFeature(id: string, is_active: boolean) {
  const res = await fetch('/api/master/features', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, is_active }),
  })
  if (!res.ok) throw new Error('Failed to toggle feature')
  return res.json()
}

async function selectSchools(id: string, school_ids: number[]) {
  const res = await fetch('/api/master/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, school_ids }),
  })
  if (!res.ok) throw new Error('Failed to update schools')
  return res.json()
}

const priorityColors: Record<string, string> = {
  عالية: 'text-rose-400',
  متوسطة: 'text-amber-400',
  منخفضة: 'text-emerald-400',
}

export default function FeaturesPage() {
  const [schoolModalId, setSchoolModalId] = useState<string | null>(null)
  const [selectedSchools, setSelectedSchools] = useState<number[]>([])
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['master-features'],
    queryFn: fetchFeatures,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleFeature(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-features'] })
    },
  })

  const schoolMutation = useMutation({
    mutationFn: ({ id, school_ids }: { id: string; school_ids: number[] }) =>
      selectSchools(id, school_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-features'] })
      setSchoolModalId(null)
    },
  })

  const openSchoolModal = useCallback(
    (feature: Feature) => {
      setSelectedSchools(feature.enabled_schools)
      setSchoolModalId(feature.id)
    },
    []
  )

  const toggleSchool = useCallback((schoolId: number) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    )
  }, [])

  const selectAllSchools = useCallback(() => {
    if (!data?.schools) return
    setSelectedSchools(data.schools.map((s) => s.id))
  }, [data?.schools])

  const deselectAllSchools = useCallback(() => {
    setSelectedSchools([])
  }, [])

  const handleSchoolSave = useCallback(() => {
    if (!schoolModalId) return
    schoolMutation.mutate({ id: schoolModalId, school_ids: selectedSchools })
  }, [schoolModalId, selectedSchools, schoolMutation])

  const activeFeature = data?.data?.find((f) => f.id === schoolModalId)

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      )}

      {isError && (
        <div className="glass-card rounded-2xl p-6 text-center text-[var(--text-muted)]">
          تعذر تحميل الميزات
        </div>
      )}

      {!isLoading && !isError && data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Zap
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'glass-card rounded-2xl p-5 group transition-all',
                  !feature.is_active && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                      feature.is_active
                        ? 'bg-[var(--primary-light)] group-hover:bg-[var(--sidebar-active-bg)]'
                        : 'bg-[var(--sidebar-hover-bg)]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        feature.is_active
                          ? 'text-[var(--primary)]'
                          : 'text-[var(--text-muted)]'
                      )}
                    />
                  </div>
                  <ToggleSwitch
                    checked={feature.is_active}
                    onChange={(checked) =>
                      toggleMutation.mutate({ id: feature.id, is_active: checked })
                    }
                  />
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  {feature.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        feature.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)]'
                      )}
                    >
                      {feature.is_active ? 'مفعّلة' : 'معطّلة'}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        priorityColors[feature.priority] || 'text-[var(--text-muted)]'
                      )}
                    >
                      {feature.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--sidebar-border)]">
                  <button
                    onClick={() => openSchoolModal(feature)}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    <School className="w-3.5 h-3.5" />
                    تفعيل لمدارس محددة
                    {feature.enabled_schools.length > 0 && (
                      <span className="bg-[var(--primary-light)] text-[var(--primary)] px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {feature.enabled_schools.length}
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <GlassModal
        open={schoolModalId !== null}
        onClose={() => setSchoolModalId(null)}
        title={activeFeature ? `تفعيل "${activeFeature.name}" لمدارس محددة` : 'اختيار المدارس'}
      >
        {data?.schools && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--sidebar-border)]">
              <button
                onClick={selectAllSchools}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                تحديد الكل
              </button>
              <button
                onClick={deselectAllSchools}
                className="text-xs text-[var(--text-muted)] hover:underline"
              >
                إلغاء الكل
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {data.schools.map((school) => {
                const isSelected = selectedSchools.includes(school.id)
                return (
                  <label
                    key={school.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                      isSelected
                        ? 'bg-[var(--primary-light)]'
                        : 'hover:bg-[var(--sidebar-hover-bg)]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--card-border)]'
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-[var(--text-main)]">{school.name}</span>
                  </label>
                )
              })}
            </div>
            {selectedSchools.length > 0 && (
              <p className="text-xs text-[var(--text-muted)] px-1">
                تم اختيار {selectedSchools.length} مدرسة
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSchoolModalId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSchoolSave}
                disabled={schoolMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {schoolMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {schoolMutation.isPending ? 'جاري الحفظ...' : 'حفظ التحديد'}
              </button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  )
}