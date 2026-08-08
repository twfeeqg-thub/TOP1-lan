'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/sector-types'
import { resolveLangText } from '@/lib/i18n-sector'
import { useApp } from '@/app/providers'
import { usePsychMessages } from '@/hooks/use-psych-message'
import { faqOpenMessages } from '@/lib/psych-support'

export default function DynamicFAQ({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const { lang } = useApp()

  const faqMessages = usePsychMessages(faqOpenMessages, faqs.length)

  if (!faqs || faqs.length === 0) return null

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openId === faq.id
          const faqMsg = faqMessages[idx]
          const question = resolveLangText(faq.question, faq.question_en, lang)
          const answer = resolveLangText(faq.answer, faq.answer_en, lang)

          return (
            <motion.div
              key={faq.id}
              layout
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                boxShadow: isOpen ? '0 0 24px var(--glow-color)' : undefined,
              }}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-right cursor-pointer"
                style={{ color: 'var(--text-main)' }}
                aria-expanded={isOpen}
              >
                <span className="text-sm md:text-base font-semibold leading-relaxed flex-1">
                  {question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                >
                  <ChevronDown
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--primary)' }}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 md:px-6 pb-3 text-xs font-medium"
                      style={{ color: 'var(--primary)' }}
                    >
                      {faqMsg}
                    </div>
                    <div
                      className="px-5 md:px-6 pb-5 md:pb-6 text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
