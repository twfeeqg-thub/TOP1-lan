'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Testimonial } from '@/lib/sector-types'

export default function DynamicTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!testimonials || testimonials.length === 0) return null

  const current = testimonials[activeIndex]

  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="glass-card rounded-2xl p-8 md:p-12 relative">
        <Quote
          className="absolute top-4 right-4 w-10 h-10 opacity-20"
          style={{ color: 'var(--primary)' }}
        />

        <p
          className="text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8 min-h-[80px]"
          style={{ color: 'var(--text-main)' }}
        >
          {current.content}
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={goPrev}
            className="p-2 rounded-full transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: 'var(--glow-color)', color: 'var(--primary)' }}
            aria-label="السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>
              {current.name}
            </p>
            {current.role && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {current.role}
              </p>
            )}
          </div>

          <button
            onClick={goNext}
            className="p-2 rounded-full transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: 'var(--glow-color)', color: 'var(--primary)' }}
            aria-label="التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: idx === activeIndex ? '24px' : '8px',
                height: '8px',
                backgroundColor: idx === activeIndex ? 'var(--primary)' : 'var(--card-border)',
              }}
              aria-label={`الانتقال إلى الشهادة ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
