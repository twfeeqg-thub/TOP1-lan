'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/sector-types'

export default function DynamicFAQ({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (!faqs || faqs.length === 0) return null

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id

          return (
            <div
              key={faq.id}
              className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-right cursor-pointer"
                style={{ color: 'var(--text-main)' }}
                aria-expanded={isOpen}
              >
                <span className="text-sm md:text-base font-semibold leading-relaxed flex-1">
                  {faq.question}
                </span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-300"
                  style={{
                    color: 'var(--primary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {isOpen && (
                <div
                  className="px-5 md:px-6 pb-5 md:pb-6 text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
