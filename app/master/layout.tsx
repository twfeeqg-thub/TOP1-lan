'use client'

import { type ReactNode } from 'react'
import { MasterLayoutV2 } from './versions/v2/MasterLayout'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function MasterRootLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.replace('/master/login')
  //   }
  // }, [isLoading, isAuthenticated, router])

  // if (isLoading) {
  //   return (
  //     <div className="h-screen bg-[var(--bg-main)] flex items-center justify-center">
  //       <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
  //     </div>
  //   )
  // }

  // if (!isAuthenticated) return null

  // const allowed = user?.role === 'super_admin' || user?.role === 'master'
  // if (!allowed) {
  //   return (
  //     <div className="h-screen bg-[var(--bg-main)] flex items-center justify-center">
  //       <p className="text-[var(--text-muted)]">ليس لديك صلاحية الوصول</p>
  //     </div>
  //   )
  // }

  return <MasterLayoutV2>{children}</MasterLayoutV2>
}
