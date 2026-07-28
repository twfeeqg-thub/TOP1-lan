'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ExamEnginePage() {
  const router = useRouter()

  useEffect(() => {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
    if (devMode) {
      router.replace('/exam-engine/maker')
    } else {
      router.replace('/login?service=exam-engine')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="glow-orb mx-auto mb-4" />
        <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
          جاري التوجيه...
        </p>
      </div>
    </div>
  )
}
