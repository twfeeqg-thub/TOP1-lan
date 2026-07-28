'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowLeft, Sparkles } from 'lucide-react'
import { Ad_Renderer_Component } from '@/components/ad-renderer'
import IconFrame from '@/components/exam-engine/IconFrame'
import SmartTooltip from '@/components/exam-engine/SmartTooltip'
import { usePsychMessage } from '@/lib/psych-support'

export default function TakerPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const psych = usePsychMessage()

  if (started) {
    router.push('/exam-engine/taker/arena')
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col" dir="rtl">
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="glass-card rounded-3xl p-8 md:p-12 max-w-lg w-full glow-card text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <IconFrame icon={<GraduationCap className="w-10 h-10" />} audience="student" className="mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold mt-6"
          >
            مرحباً بك في الاختبار
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {psych.getWelcome()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 glass-card rounded-2xl p-4 text-right"
            style={{ borderRight: '3px solid var(--primary)' }}
          >
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <span className="font-bold" style={{ color: 'var(--text-main)' }}>تعليمات: </span>
              أجب عن الأسئلة بدقة. ستظهر شروحات مبسطة بعد الإجابات الخاطئة مع سؤال بديل. خذ وقتك وركز.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <SmartTooltip message={psych.getHover()}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStarted(true)}
                className="glass-card rounded-2xl px-10 py-4 flex items-center gap-3 cursor-pointer glow-card mx-auto"
              >
                <span className="font-bold text-lg">ابدأ الاختبار</span>
                <ArrowLeft className="w-6 h-6" />
                <Sparkles className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </motion.button>
            </SmartTooltip>
          </motion.div>
        </motion.div>
      </div>

      <Ad_Renderer_Component placement="bottom" lang="ar" ads={[]} />
    </div>
  )
}
