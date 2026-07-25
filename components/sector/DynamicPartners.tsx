import type { Partner } from '@/lib/sector-types'

export default function DynamicPartners({ partners }: { partners: Partner[] }) {
  if (!partners || partners.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="glass-card rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
