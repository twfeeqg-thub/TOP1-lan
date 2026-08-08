'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { AuthRole } from '@/lib/auth'

interface RequireRoleProps {
  role: AuthRole | AuthRole[]
  children: ReactNode
}

/**
 * Page-level role gate (defense-in-depth for the middleware, which only
 * authenticates and never authorizes). Renders `children` only when the live
 * session role matches one of the allowed roles, otherwise a polite access
 * denied card with a safe return link.
 */
export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth()

  const allowed = Array.isArray(role) ? role.includes(user?.role as AuthRole) : user?.role === role

  if (isLoading) {
    return (
      <div className="glass-card mx-auto flex max-w-md items-center justify-center gap-3 rounded-3xl p-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <p className="text-sm text-[var(--text-muted)]">جارٍ التحقق من الصلاحيات…</p>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="glass-card mx-auto max-w-md rounded-3xl p-10 text-center">
        <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-500" />
        <p className="mb-2 text-base font-black text-[var(--text-main)]">غير مصرح لك بالوصول</p>
        <p className="mb-6 text-sm text-[var(--text-muted)]">هذه الصفحة متاحة لصلاحية محددة فقط.</p>
        <Link
          href="/master"
          className="inline-flex min-h-[44px] touch-target items-center justify-center rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)]"
        >
          العودة إلى لوحة القيادة
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
