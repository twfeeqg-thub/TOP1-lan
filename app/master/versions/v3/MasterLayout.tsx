'use client'

import type { ReactNode } from 'react'
import { SidebarV3 } from './Sidebar'
import { TopbarV3 } from './Topbar'

export function MasterLayoutV3({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090d16] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle dot grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <SidebarV3 />
      <TopbarV3 />
      <main className="min-h-screen mr-[264px] pt-16 p-6 relative z-10">
        {children}
      </main>
    </div>
  )
}
