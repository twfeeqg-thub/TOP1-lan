'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2, FolderKanban, CheckCircle2 } from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { cn } from '@/lib/utils'
import { useOutbox } from '@/hooks/use-outbox'
import { getRandomMessage, loadingMessages, emptyMessages, successMessages } from '@/lib/psych-support'

interface Project {
  id: string
  name: string
  slug: string
  sector_name: string
  is_active: boolean
  modules_config: Record<string, unknown>
  created_at: string
}

async function fetchProjects(): Promise<{ data: Project[] }> {
  const res = await fetch('/api/master/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

async function createProject(data: {
  name: string
  slug: string
  sector_name: string
  modules_config: string
}) {
  const res = await fetch('/api/master/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      slug: data.slug,
      sector_name: data.sector_name,
      modules_config: data.modules_config ? JSON.parse(data.modules_config) : {},
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create project')
  }
  return res.json()
}

interface Sector {
  id: string
  name: string
  slug: string
  is_active: boolean
}

async function fetchSectors(): Promise<{ data: Sector[] }> {
  const res = await fetch('/api/master/sectors')
  if (!res.ok) throw new Error('Failed to fetch sectors')
  return res.json()
}

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', sector_name: '', modules_config: '' })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { enqueueMutation } = useOutbox()

  const loadingMsg = useMemo(() => getRandomMessage(loadingMessages), [])
  const emptyMsg = useMemo(() => getRandomMessage(emptyMessages), [])

  const flashSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg)
    window.setTimeout(() => setSuccessMsg(null), 2500)
  }, [])

  const { data: sectorsData } = useQuery({
    queryKey: ['master-sectors'],
    queryFn: fetchSectors,
  })
  const sectors = (sectorsData?.data ?? []).filter((s) => s.is_active)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['master-projects'],
    queryFn: fetchProjects,
  })

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-projects'] })
      setModalOpen(false)
      setForm({ name: '', slug: '', sector_name: '', modules_config: '' })
      setError('')
      flashSuccess(getRandomMessage(successMessages))
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      if (!form.name || !form.slug || !form.sector_name) {
        setError('يرجى ملء جميع الحقول المطلوبة')
        return
      }

      let parsedConfig = {}
      if (form.modules_config.trim()) {
        try {
          parsedConfig = JSON.parse(form.modules_config)
        } catch {
          setError('تنسيق JSON غير صحيح في حقل التهيئة')
          return
        }
      }

      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        enqueueMutation({
          action: 'project.upsert',
          entity_type: 'project',
          entity_id: form.slug,
          payload: {
            slug: form.slug,
            sector_name: form.sector_name,
            modules_config: parsedConfig,
          },
        }).then(() => {
          setModalOpen(false)
          setForm({ name: '', slug: '', sector_name: '', modules_config: '' })
          setError('')
          flashSuccess(getRandomMessage(successMessages))
        })
        return
      }

      mutation.mutate(form)
    },
    [form, mutation, enqueueMutation, flashSuccess]
  )

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      setForm((prev) => ({
        ...prev,
        name,
        slug: name
          ? name
              .replace(/[^\w\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
              .toLowerCase()
          : '',
      }))
    },
    []
  )

  const projects = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => setModalOpen(true)}
          className="touch-target flex min-h-[44px] items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--glow-color)]"
        >
          <Plus className="w-4 h-4" />
          إضافة مشروع جديد
        </button>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="glassy-toast flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-main)]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="truncate">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-14">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--text-muted)]">{loadingMsg}</p>
        </div>
      )}

      {isError && (
        <div className="glass-card rounded-2xl p-6 text-center text-[var(--text-muted)]">
          تعذر تحميل المشاريع
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="glass-edge rounded-2xl p-10 text-center"
        >
          <FolderKanban className="w-10 h-10 mx-auto mb-3 text-[var(--primary)]/60" />
          <p className="text-base font-bold text-[var(--text-main)]">{emptyMsg}</p>
          <button
            onClick={() => setModalOpen(true)}
            className="touch-target min-h-[44px] mt-4 text-sm text-[var(--primary)] hover:underline"
          >
            إضافة أول مشروع
          </button>
        </motion.div>
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--sidebar-border)]">
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">اسم المشروع</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الكود</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">القطاع</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الحالة</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15, delay: i * 0.04 }}
                    className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[var(--text-main)]">{p.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-xs text-[var(--text-muted)] bg-[var(--sidebar-hover-bg)] px-2 py-0.5 rounded">{p.slug}</code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--text-muted)]">{p.sector_name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'pill',
                          p.is_active
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        )}
                      >
                        <span className={cn('status-dot', p.is_active ? 'status-dot-active' : 'status-dot-paused')} />
                        {p.is_active ? 'نشط' : 'متوقف'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-muted)]">
                      {new Date(p.created_at).toLocaleDateString('ar-SA')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden grid grid-cols-1 gap-3 p-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: i * 0.04 }}
                whileTap={{ scale: 0.99 }}
                className="glass-edge rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">{p.name}</p>
                    <code className="text-xs text-[var(--text-muted)] bg-[var(--sidebar-hover-bg)] px-2 py-0.5 rounded mt-1 inline-block" dir="ltr">
                      {p.slug}
                    </code>
                  </div>
                  <span
                    className={cn(
                      'pill shrink-0',
                      p.is_active
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    )}
                  >
                    <span className={cn('status-dot', p.is_active ? 'status-dot-active' : 'status-dot-paused')} />
                    {p.is_active ? 'نشط' : 'متوقف'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{p.sector_name}</span>
                  <span>{new Date(p.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <GlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="إضافة مشروع جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">اسم المشروع</label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="مثال: المنصة التعليمية"
              className="glass-input touch-target min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الكود (Project Slug)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="مثال: edu-platform"
              className="glass-input touch-target min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">اسم القطاع</label>
            <select
              value={form.sector_name}
              onChange={(e) => setForm((p) => ({ ...p, sector_name: e.target.value }))}
              className="glass-input touch-target min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none"
            >
              <option value="">اختر القطاع</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              تهيئة المشروع (JSON) - اختياري
            </label>
            <textarea
              value={form.modules_config}
              onChange={(e) => setForm((p) => ({ ...p, modules_config: e.target.value }))}
              placeholder='{"version": "2.0", "features": ["analytics", "reports"]}'
              rows={4}
              className="glass-input touch-target min-h-[44px] w-full rounded-xl px-4 py-2.5 text-sm outline-none font-mono resize-none"
              dir="ltr"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="touch-target min-h-[44px] flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="touch-target min-h-[44px] flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {mutation.isPending ? 'جاري الحفظ...' : 'حفظ المشروع'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  )
}