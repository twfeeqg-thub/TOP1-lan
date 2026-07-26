'use client'

import { motion } from 'motion/react'
import type { Partner } from '@/lib/sector-types'
import { usePsychMessage } from '@/hooks/use-psych-message'
import { trustMessages } from '@/lib/psych-support'

export default function DynamicPartners({ partners }: { partners: Partner[] }) {
  if (!partners || partners.length === 0) return null

  const trustMsg = usePsychMessage(trustMessages)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        className="glass-card rounded-2xl p-8 md:p-12"
      >
        <p
          className="text-sm font-medium text-center mb-8"
          style={{ color: 'var(--primary)' }}
        >
          {trustMsg}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'var(--glow-color)' }}
            >
              {partner.logo && (
                <div
                  className="w-16 h-16 rounded-xl opacity-70 grayscale hover:grayscale-0 transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card-border)',
                    backgroundImage: `url(${partner.logo})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
              <span
                className="text-xs font-semibold text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
