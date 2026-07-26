'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ExternalLink, FileText, Bot, School, Building, BookOpen } from 'lucide-react'
import type { Project } from '@/lib/sector-types'
import { usePsychMessages } from '@/hooks/use-psych-message'
import { encouragementMessages } from '@/lib/psych-support'
import IconFrame from './IconFrame'
import SmartTooltip from './SmartTooltip'

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8" />,
  Bot: <Bot className="w-8 h-8" />,
  School: <School className="w-8 h-8" />,
  Building: <Building className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
}

export default function DynamicProjects({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null

  const projectMessages = usePsychMessages(encouragementMessages, projects.length)

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const springTransition = { type: 'spring' as const, stiffness: 120, damping: 16 }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {projects.map((project, idx) => {
          const topFeatures = project.features?.slice(0, 3) ?? []
          const encouragementMsg = projectMessages[idx]

          return (
            <motion.div
              key={project.id}
              variants={cardVariants}
              transition={springTransition}
              className="glass-card glow-card rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-300"
            >
              <div className="flex items-start gap-5 mb-5">
                <IconFrame
                  icon={iconMap[project.icon] || <FileText className="w-8 h-8" />}
                  audience={project.audience}
                />
                <div className="min-w-0 pt-1">
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
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {project.description}
                </p>
              )}

              <div
                className="text-xs font-medium mb-4 px-3 py-1.5 rounded-lg inline-block self-start"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                {encouragementMsg}
              </div>

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
                  <SmartTooltip>
                    <Link
                      href={project.register_link}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
                    >
                      طلب الخدمة
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </SmartTooltip>
                )}
                {project.login_link && (
                  <SmartTooltip>
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
                  </SmartTooltip>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
