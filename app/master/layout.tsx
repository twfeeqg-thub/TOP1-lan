'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { VersionSwitcher, type MasterVersion } from './components/version-switcher'
import { MasterLayoutV1 } from './versions/v1/MasterLayout'
import { MasterLayoutV2 } from './versions/v2/MasterLayout'
import { MasterLayoutV3 } from './versions/v3/MasterLayout'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'aisahl-master-version'

export default function MasterRootLayout({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<MasterVersion>('v1')
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as MasterVersion | null
    if (saved && ['v1', 'v2', 'v3'].includes(saved)) {
      setVersion(saved)
    }
  }, [])

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.replace('/master/login')
  //   }
  // }, [isLoading, isAuthenticated, router])

  const handleVersionChange = (v: MasterVersion) => {
    setVersion(v)
    localStorage.setItem(STORAGE_KEY, v)
  }

  // if (isLoading) {
  //   return (
  //     <div className="h-screen bg-[#090d16] flex items-center justify-center">
  //       <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
  //     </div>
  //   )
  // }

  // if (!isAuthenticated) return null

  // const allowed = user?.role === 'super_admin' || user?.role === 'master'
  // if (!allowed) {
  //   return (
  //     <div className="h-screen bg-[#090d16] flex items-center justify-center">
  //       <p className="text-white/50">ليس لديك صلاحية الوصول</p>
  //     </div>
  //   )
  // }

  const layouts: Record<MasterVersion, React.FC<{ children: ReactNode }>> = {
    v1: MasterLayoutV1,
    v2: MasterLayoutV2,
    v3: MasterLayoutV3,
  }
  const Layout = layouts[version]

  return (
    <>
      <VersionSwitcher version={version} onChange={handleVersionChange} />
      <Layout>{children}</Layout>
    </>
  )
}
