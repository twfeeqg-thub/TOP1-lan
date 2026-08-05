'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ExamEnginePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, subscriptions } = useAuth()

  useEffect(() => {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
    if (devMode) {
      router.replace('/exam-engine/maker')
      return
    }

    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.replace('/login?service=exam-engine')
      return
    }

    if (user.role === 'super_admin' || user.role === 'master') {
      router.replace('/exam-engine/maker')
      return
    }

    if (subscriptions.includes('exam-engine')) {
      router.replace('/exam-engine/taker')
      return
    }

    router.replace('/login?service=exam-engine')
  }, [router, isAuthenticated, isLoading, user, subscriptions])

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
