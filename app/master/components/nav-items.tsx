'use client'

import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, FolderKanban, Megaphone, Zap, Users, Settings } from 'lucide-react'

export interface NavItem {
  id: string
  labelAr: string
  labelEn: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: 'dashboard', labelAr: 'لوحة القيادة', labelEn: 'Dashboard', href: '/master', icon: LayoutDashboard },
  { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', href: '/master/projects', icon: FolderKanban },
  { id: 'ads', labelAr: 'الإعلانات', labelEn: 'Ads', href: '/master/ads', icon: Megaphone },
  { id: 'features', labelAr: 'الميزات', labelEn: 'Features', href: '/master/features', icon: Zap },
  { id: 'users', labelAr: 'المستخدمون', labelEn: 'Users', href: '/master/users', icon: Users },
  { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', href: '/master/settings', icon: Settings },
]

export function useNavItems() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/master') return pathname === '/master'
    return pathname.startsWith(href)
  }

  return { navItems, isActive }
}

export function getPageTitle(pathname: string, lang: 'ar' | 'en'): string {
  const item = navItems.find(
    (n) => n.href !== '/master' && pathname.startsWith(n.href)
  )
  if (!item) {
    if (pathname === '/master') return lang === 'ar' ? 'لوحة القيادة' : 'Dashboard'
    return lang === 'ar' ? 'لوحة الماستر' : 'Master Panel'
  }
  return lang === 'ar' ? item.labelAr : item.labelEn
}
