import type { About } from '@/lib/sector-types'

export default function DynamicAbout({ about }: { about: About }) {
  if (!about?.title && !about?.description) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="glass-card rounded-2xl p-8 md:p-12">
        {about.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-4 text-center"
            style={{ color: 'var(--text-main)' }}
          >
            {about.title}
          </h2>
        )}
        {about.description && (
          <p
            className="text-base leading-relaxed text-center max-w-3xl mx-auto mb-10"
            style={{ color: 'var(--text-muted)' }}
          >
            {about.description}
          </p>
        )}
        {about.highlights && about.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.highlights.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5 text-center transition-all duration-200"
                style={{ backgroundColor: 'var(--glow-color)' }}
              >
                {item.icon && (
                  <div className="text-3xl mb-3">{item.icon}</div>
                )}
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-main)' }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
