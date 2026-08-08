'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, FolderKanban } from 'lucide-react'
import { ProjectControlCard, type ProjectControl } from './ProjectControlCard'

async function fetchProjects(): Promise<{ data: ProjectControl[] }> {
  const res = await fetch('/api/master/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

/**
 * Dynamic Projects Grid — fetches live from `/api/master/projects`
 * (React Query key `master-projects`) and renders ProjectControlCards. Any
 * change to `core.project_definitions` is reflected automatically via
 * `useMasterRealtime` cache invalidation.
 */
export function DynamicProjectsGrid() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['master-projects'],
    queryFn: fetchProjects,
  })

  const projects = data?.data ?? []

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
        <FolderKanban className="h-4 w-4 text-[var(--primary)]" />
        المشاريع
        <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
          {projects.length}
        </span>
      </h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      )}

      {isError && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="mb-4 text-[var(--text-muted)]">تعذر تحميل المشاريع</p>
          <button
            onClick={() => refetch()}
            className="min-h-[44px] touch-target rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد مشاريع بعد</p>
        </div>
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectControlCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
