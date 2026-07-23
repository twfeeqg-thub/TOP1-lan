'use client'

import { cn } from '@/lib/utils'

interface SidebarLogoProps {
  collapsed?: boolean
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-white/5',
        collapsed && 'justify-center px-0'
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
        <span className="text-white font-bold text-sm">ذ</span>
      </div>
      {!collapsed && (
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white leading-tight">ذكاء سهل</p>
          <p className="text-[10px] text-white/40">Master Panel</p>
        </div>
      )}
    </div>
  )
}
