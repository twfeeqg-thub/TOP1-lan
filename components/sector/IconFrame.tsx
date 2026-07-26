'use client'

import { type ReactNode } from 'react'

interface IconFrameProps {
  icon: ReactNode
  audience?: 'student' | 'professional'
}

export default function IconFrame({ icon, audience }: IconFrameProps) {
  const isStudent = audience === 'student'

  return (
    <div className={`icon-frame ${isStudent ? 'icon-frame-student' : 'icon-frame-professional'}`}>
      <div className={isStudent ? 'text-white' : ''} style={{ color: isStudent ? undefined : 'var(--primary)' }}>
        {icon}
      </div>
    </div>
  )
}
