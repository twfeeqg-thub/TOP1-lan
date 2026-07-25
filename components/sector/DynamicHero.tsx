import Link from 'next/link'
import type { Hero } from '@/lib/sector-types'

export default function DynamicHero({ hero }: { hero: Hero }) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20"
      style={{
        backgroundColor: 'var(--glow-color)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {hero.badge && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5"
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--card-border)',
            }}
          >
            {hero.badge}
          </span>
        )}
        {hero.title && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            style={{ color: 'var(--text-main)' }}
          >
            {hero.title}
          </h1>
        )}
        {hero.description && (
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            {hero.description}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
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
        </div>
      </div>
      {(hero.cover_image) && (
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
