import Link from 'next/link'
import { Sparkles, CheckCircle2, ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/sector-types'

export default function DynamicProjects({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const topFeatures = project.features?.slice(0, 3) ?? []

          return (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-5">
                {project.icon && (
                  <div className="text-4xl md:text-5xl shrink-0 leading-none">{project.icon}</div>
                )}
                <div className="min-w-0">
                  <h3
                    className="text-xl md:text-2xl font-bold mb-1"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {project.name}
                  </h3>
                </div>
              </div>

              {project.description && (
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {project.description}
                </p>
              )}

              {topFeatures.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                      المميزات
                    </span>
                  </div>
                  <div className="space-y-2">
                    {topFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--glow-color)' }}
                      >
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-main)' }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto" />

              <div className="flex flex-wrap gap-3">
                {project.register_link && (
                  <Link
                    href={project.register_link}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
                  >
                    طلب الخدمة
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {project.login_link && (
                  <Link
                    href={project.login_link}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      color: 'var(--text-main)',
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      backdropFilter: 'blur(var(--glass-blur))',
                    }}
                  >
                    تسجيل الدخول
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
