'use client'

import { type ReactNode } from 'react'

interface IconFrameProps {
  icon: ReactNode
  audience?: 'student' | 'professional'
  className?: string
}

export default function IconFrame({ icon, audience, className = '' }: IconFrameProps) {
  const isStudent = audience === 'student'

  return (
    <div
      className={`icon-frame ${isStudent ? 'icon-frame-student' : 'icon-frame-professional'} ${className}`}
    >
      <div className={isStudent ? 'text-white' : ''} style={{ color: isStudent ? undefined : 'var(--primary)' }}>
        {icon}
      </div>
    </div>
  )
}
