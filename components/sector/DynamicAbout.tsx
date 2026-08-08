'use client'

import { motion } from 'motion/react'
import type { About } from '@/lib/sector-types'
import { resolveLangText } from '@/lib/i18n-sector'
import { useApp } from '@/app/providers'
import { usePsychMessage } from '@/hooks/use-psych-message'
import { trustMessages } from '@/lib/psych-support'
import IconFrame from './IconFrame'

const highlightIconMap: Record<string, React.ReactNode> = {
  School: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Users: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
  Heart: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Headphones: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
}

export default function DynamicAbout({ about }: { about: About }) {
  const { lang } = useApp()
  const trustMsg = usePsychMessage(trustMessages)

  const title = resolveLangText(about?.title, about?.title_en, lang)
  const description = resolveLangText(about?.description, about?.description_en, lang)
  const highlights = (about?.highlights ?? []).map((h) => ({
    ...h,
    text: resolveLangText(h.text, h.text_en, lang),
  }))

  if (!title && !description) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        className="glass-card rounded-2xl p-8 md:p-12"
      >
        {title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-4 text-center"
            style={{ color: 'var(--text-main)' }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            className="text-base leading-relaxed text-center max-w-3xl mx-auto mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </p>
        )}

        <p
          className="text-sm font-medium text-center mb-10"
          style={{ color: 'var(--primary)' }}
        >
          {trustMsg}
        </p>

        {highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, type: 'spring', stiffness: 120, damping: 14 }}
                className="rounded-xl p-5 text-center transition-all duration-200"
                style={{ backgroundColor: 'var(--glow-color)' }}
              >
                {item.icon && (
                  <div className="flex justify-center mb-3">
                    <IconFrame
                      icon={highlightIconMap[item.icon] || <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      audience="professional"
                    />
                  </div>
                )}
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-main)' }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
