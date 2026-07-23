'use client'

import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useApp } from '@/app/providers'
import { useAuth } from '@/context/AuthContext'
import { getPageTitle } from '../../components/nav-items'
import ThemeSwitcher from '@/components/auth/ThemeSwitcher'

export function TopbarV2() {
  const pathname = usePathname()
  const { lang } = useApp()
  const { user, logout } = useAuth()
  const title = getPageTitle(pathname, lang)

  return (
    <header className="h-16 flex items-center justify-between px-6 backdrop-blur-xl bg-black/30 border-b border-white/5">
      <h1 className="text-lg font-bold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-default">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <span className="text-indigo-400 text-xs font-bold">
              {(user?.name || 'A')[0]}
            </span>
          </div>
          <span className="text-sm text-white/70">{user?.name || 'Admin'}</span>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
