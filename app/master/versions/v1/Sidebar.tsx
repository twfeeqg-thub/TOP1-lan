'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useNavItems } from '../../components/nav-items'
import { SidebarLogo } from '../../components/sidebar-logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function SidebarV1() {
  const { navItems, isActive } = useNavItems()
  const { user } = useAuth()

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[260px] z-40 flex flex-col bg-[#070b14] border-l border-white/5">
      <SidebarLogo />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative',
                active
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {active && (
                <motion.div
                  layoutId="v1-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.labelAr}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 text-sm font-bold">
              {(user?.name || 'A')[0]}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[11px] text-white/40">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
