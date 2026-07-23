'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useNavItems } from '../../components/nav-items'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function SidebarV3() {
  const { navItems, isActive } = useNavItems()
  const { user } = useAuth()

  return (
    <aside className="fixed right-4 top-4 bottom-4 w-[240px] z-40 flex flex-col rounded-2xl backdrop-blur-2xl bg-[#0a0e1a]/80 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_60px_rgba(99,102,241,0.06)]">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(99,102,241,0.35)]">
          <span className="text-white font-bold text-sm">ذ</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">ذكاء سهل</p>
          <p className="text-[10px] text-white/40">Master Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative',
                active
                  ? 'text-indigo-400 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
              )}
            >
              {active && (
                <motion.div
                  layoutId="v3-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                />
              )}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                  active
                    ? 'bg-indigo-500/15'
                    : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4 transition-all duration-300',
                  active && 'text-indigo-400',
                  !active && 'text-white/40 group-hover:text-white/70'
                )} />
              </div>
              <span className={cn(
                'transition-all duration-300',
                active && 'translate-x-[-2px]'
              )}>{item.labelAr}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            <span className="text-white text-sm font-bold">
              {(user?.name || 'A')[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-white/40">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
