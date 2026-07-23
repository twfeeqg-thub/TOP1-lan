'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react'
import { useApp } from '@/app/providers'
import { useAuth } from '@/context/AuthContext'
import { getPageTitle } from '../../components/nav-items'
import ThemeSwitcher from '@/components/auth/ThemeSwitcher'
import { cn } from '@/lib/utils'

export function TopbarV3() {
  const pathname = usePathname()
  const { lang } = useApp()
  const { user, logout } = useAuth()
  const title = getPageTitle(pathname, lang)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 flex items-center justify-between px-6 backdrop-blur-2xl bg-[#0a0e1a]/40 border-b border-white/5">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <span className="text-xs text-white/20">/</span>
        <span className="text-xs text-white/40">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-all">
          <Search className="w-4 h-4" />
        </button>

        <ThemeSwitcher />

        <button className="relative p-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.2)]">
              <span className="text-white text-xs font-bold">
                {(user?.name || 'A')[0]}
              </span>
            </div>
            <span className="text-sm text-white/70">{user?.name || 'Admin'}</span>
            <ChevronDown className={cn(
              'w-3 h-3 text-white/40 transition-transform duration-200',
              menuOpen && 'rotate-180'
            )} />
          </button>

          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl backdrop-blur-2xl bg-[#0a0e1a]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-white/40">{user?.phone || 'admin@aisahl.com'}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
