'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { Hero } from '@/lib/sector-types'
import { usePsychMessage } from '@/hooks/use-psych-message'
import { welcomeMessages } from '@/lib/psych-support'

export default function DynamicHero({ hero }: { hero: Hero }) {
  const welcomeMsg = usePsychMessage(welcomeMessages)

  return (
    <section
      className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20"
      style={{
        backgroundColor: 'var(--glow-color)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <div className="absolute top-10 left-1/2 -translate-x-1/2 glow-orb" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {hero.badge && (
          <motion.span
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5"
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--card-border)',
            }}
          >
            {hero.badge}
          </motion.span>
        )}

        {hero.title && (
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            style={{ color: 'var(--text-main)' }}
          >
            {hero.title}
          </motion.h1>
        )}

        {hero.description && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            {hero.description}
          </motion.p>
        )}

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          className="text-sm font-medium mb-8"
          style={{ color: 'var(--primary)' }}
        >
          {welcomeMsg}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {hero.cta_primary?.href && (
            <Link
              href={hero.cta_primary.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
            >
              {hero.cta_primary.text}
            </Link>
          )}
          {hero.cta_secondary?.href && (
            <Link
              href={hero.cta_secondary.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                color: 'var(--text-main)',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                backdropFilter: 'blur(var(--glass-blur))',
              }}
            >
              {hero.cta_secondary.text}
            </Link>
          )}
        </motion.div>
      </motion.div>

      {hero.cover_image && (
        <div
          className="absolute inset-0 -z-0 opacity-[0.04]"
          style={{
            backgroundImage: `url(${hero.cover_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
    </section>
  )
}
