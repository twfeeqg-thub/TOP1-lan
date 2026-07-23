'use client'

import type { ReactNode } from 'react'
import { SidebarV1 } from './Sidebar'
import { TopbarV1 } from './Topbar'

export function MasterLayoutV1({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16]">
      <SidebarV1 />
      <div className="flex-1 flex flex-col mr-[260px]">
        <TopbarV1 />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
