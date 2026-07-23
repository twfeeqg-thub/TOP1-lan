'use client'

import { type ReactNode, useState } from 'react'
import { SidebarV2 } from './Sidebar'
import { TopbarV2 } from './Topbar'

const SIDEBAR_EXPANDED = 260
const SIDEBAR_COLLAPSED = 64

export function MasterLayoutV2({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16]">
      <SidebarV2 collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginRight: sidebarWidth }}
      >
        <TopbarV2 />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
