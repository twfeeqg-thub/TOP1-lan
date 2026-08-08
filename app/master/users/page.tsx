'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, Users as UsersIcon, RotateCw, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RequireRole } from '../components/require-role'
import { usePsychMessage } from '@/hooks/use-psych-message'
import { loadingMessages, emptyMessages } from '@/lib/psych-support'

export interface MasterUser {
  id: string
  name: string
  phone: string
  role: 'user' | 'master' | 'super_admin'
  is_active: boolean
  created_at: string
}

const ROLE_LABELS: Record<MasterUser['role'], string> = {
  user: 'مستخدم',
  master: 'ماستر',
  super_admin: 'مدير عام',
}

async function fetchUsers(): Promise<{ data: MasterUser[] }> {
  const res = await fetch('/api/master/users', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export default function UsersPage() {
  const loadingMsg = usePsychMessage(loadingMessages)
  const emptyMsg = usePsychMessage(emptyMessages)

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['master-users'],
    queryFn: fetchUsers,
  })

  const users = data?.data ?? []

  return (
    <RequireRole role="super_admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
            <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
            إدارة المستخدمين
            <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
              {users.length}
            </span>
          </h2>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex min-h-[44px] touch-target items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium glass-card hover:border-[var(--primary)]/50 transition-all disabled:opacity-50"
          >
            <RotateCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            تحديث القائمة
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
            <p className="text-sm text-[var(--text-muted)]">{loadingMsg}</p>
          </div>
        )}

        {isError && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="mb-4 text-[var(--text-muted)]">تعذر تحميل المستخدمين</p>
            <button
              onClick={() => refetch()}
              className="min-h-[44px] touch-target rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <UsersIcon className="mx-auto mb-3 h-9 w-9 text-[var(--primary)]/60" />
            <p className="text-base font-bold text-[var(--text-main)]">{emptyMsg}</p>
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--sidebar-border)]">
                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wider">الاسم</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wider">رقم الهاتف</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wider">الدور</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-[var(--text-muted)] tracking-wider">الحالة</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wider">تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-[var(--text-main)]">{user.name || '—'}</td>
                      <td className="px-5 py-3">
                        <code className="text-xs text-[var(--text-muted)]" dir="ltr">{user.phone}</code>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400' :
                          user.role === 'master' ? 'bg-cyan-500/10 text-cyan-400' :
                          'bg-slate-500/10 text-slate-400'
                        )}>
                          {ROLE_LABELS[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn('pill', user.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')}>
                          <span className={cn('status-dot', user.is_active ? 'status-dot-active' : 'status-dot-paused')} />
                          {user.is_active ? 'نشط' : 'موقوف'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--text-muted)]">
                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {users.map((user) => (
                <div key={user.id} className="glass-edge rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">{user.name || '—'}</p>
                    <span className={cn('pill shrink-0', user.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')}>
                      <span className={cn('status-dot', user.is_active ? 'status-dot-active' : 'status-dot-paused')} />
                      {user.is_active ? 'نشط' : 'موقوف'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]" dir="ltr">{user.phone}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{ROLE_LABELS[user.role] ?? user.role}</span>
                    <span>{new Date(user.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </RequireRole>
  )
}
