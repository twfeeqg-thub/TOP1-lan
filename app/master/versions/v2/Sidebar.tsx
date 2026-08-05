'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useNavItems } from '../../components/nav-items'
import { SidebarLogo } from '../../components/sidebar-logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Rocket, PenLine, GraduationCap, Grid3x3 } from 'lucide-react'

interface SidebarV2Props {
  collapsed: boolean
  onToggle: () => void
}

const SUPER_ADMIN_JUMPS = [
  { href: '/exam-engine/maker', label: 'محرك الاختبارات', icon: PenLine },
  { href: '/exam-engine/taker', label: 'منصة الطالب', icon: GraduationCap },
  { href: '/master/sectors', label: 'لوحة القطاعات', icon: Grid3x3 },
]

export function SidebarV2({ collapsed, onToggle }: SidebarV2Props) {
  const { user } = useAuth()
  const { navItems, isActive } = useNavItems(user?.role)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 z-40 flex flex-col bg-[var(--sidebar-bg)] border-l border-[var(--sidebar-border)] overflow-hidden"
    >
      <SidebarLogo collapsed={collapsed} />

      <div className="flex justify-center pt-2 pb-1">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
        >
          {collapsed ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {user?.role === 'super_admin' && (
        <div className="px-3 py-2">
          <div className={cn('rounded-2xl p-3 glass-card', collapsed && 'px-1')}>
            {!collapsed && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--sidebar-text-muted)] mb-2 px-1">
                <Rocket className="w-3.5 h-3.5 text-[var(--primary)]" />
                قفزات مباشرة
              </p>
            )}
            <div className="space-y-1">
              {SUPER_ADMIN_JUMPS.map((jump) => {
                const Icon = jump.icon
                return (
                  <Link
                    key={jump.href}
                    href={jump.href}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all',
                      'text-[var(--sidebar-text)] hover:bg-[var(--primary-light)] hover:border-[var(--primary)] border border-transparent',
                      collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? jump.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                    {!collapsed && <span>{jump.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative whitespace-nowrap',
                active
                  ? 'text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)]'
                  : 'text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)]',
                collapsed && 'justify-center px-0 mx-auto w-10 h-10'
              )}
              title={collapsed ? item.labelAr : undefined}
            >
              {active && !collapsed && (
                <motion.div
                  layoutId="v2-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--glow-color)]"
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.labelAr}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className={cn('border-t border-[var(--sidebar-border)] p-4', collapsed && 'p-2 flex justify-center')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-full bg-[var(--sidebar-active-bg)] flex items-center justify-center shrink-0">
            <span className="text-[var(--sidebar-active-text)] text-sm font-bold">
              {(user?.name || 'A')[0]}
            </span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-[var(--sidebar-text)] truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-[var(--sidebar-text-muted)]">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
