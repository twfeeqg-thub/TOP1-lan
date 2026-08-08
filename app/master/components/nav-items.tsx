'use client'

import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, FolderKanban, Megaphone, Zap, Grid3x3, FilePlus2 } from 'lucide-react'
import type { AuthRole } from '@/lib/auth'

export interface NavItem {
  id: string
  labelAr: string
  labelEn: string
  href: string
  icon: LucideIcon
  roles: AuthRole[]
}

export const navItems: NavItem[] = [
  { id: 'dashboard', labelAr: 'لوحة القيادة', labelEn: 'Dashboard', href: '/master', icon: LayoutDashboard, roles: ['super_admin', 'master'] },
  { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', href: '/master/projects', icon: FolderKanban, roles: ['super_admin', 'master'] },
  { id: 'ads', labelAr: 'الإعلانات', labelEn: 'Ads', href: '/master/ads', icon: Megaphone, roles: ['super_admin', 'master'] },
  { id: 'features', labelAr: 'الميزات', labelEn: 'Features', href: '/master/features', icon: Zap, roles: ['super_admin', 'master'] },
  { id: 'sectors', labelAr: 'القطاعات', labelEn: 'Sectors', href: '/master/sectors', icon: Grid3x3, roles: ['super_admin', 'master'] },
  { id: 'forms', labelAr: 'إنشاء جديد', labelEn: 'Create', href: '/master/forms', icon: FilePlus2, roles: ['super_admin', 'master'] },
]

export function getNavItems(role?: string | null): NavItem[] {
  if (role === 'super_admin') return navItems
  if (role === 'master') return navItems.filter((n) => n.roles.includes('master'))
  return []
}

export function useNavItems(role?: string | null) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/master') return pathname === '/master'
    return pathname.startsWith(href)
  }

  return { navItems: getNavItems(role), isActive }
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
