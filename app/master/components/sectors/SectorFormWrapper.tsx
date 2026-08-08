'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Sparkles, BookOpen, Users, MessageSquare, HelpCircle, Handshake, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { normalizeSectorData, type SectorData } from '@/lib/sector-types'
import { HeroSectionForm } from './HeroSectionForm'
import { ProjectsSectionForm } from './ProjectsSectionForm'
import { AboutSectionForm } from './AboutSectionForm'
import { TestimonialsSectionForm } from './TestimonialsSectionForm'
import { FAQSectionForm } from './FAQSectionForm'
import { PartnersSectionForm } from './PartnersSectionForm'
import { LegalFooterSectionForm } from './LegalFooterSectionForm'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: Tab[] = [
  { id: 'hero', label: 'الهيرو', icon: Sparkles },
  { id: 'projects', label: 'المشاريع', icon: BookOpen },
  { id: 'about', label: 'من نحن', icon: Users },
  { id: 'testimonials', label: 'الآراء', icon: MessageSquare },
  { id: 'faq', label: 'الأسئلة', icon: HelpCircle },
  { id: 'partners', label: 'الشركاء', icon: Handshake },
  { id: 'legal', label: 'القانوني', icon: FileText },
]

interface SectorFormWrapperProps {
  data: SectorData
  onChange: (data: SectorData) => void
}

export function SectorFormWrapper({ data, onChange }: SectorFormWrapperProps) {
  const [activeTab, setActiveTab] = useState('hero')

  // Defensive normalization: freshly seeded sectors may carry `full_data = {}`
  // (or partially-shaped JSONB). Deep-merging against defaults guarantees every
  // section form reads a complete, typed tree — no undefined access.
  const safe = normalizeSectorData(data)

  const updateSection = useCallback(
    <K extends keyof SectorData>(section: K, value: SectorData[K]) => {
      onChange({ ...safe, [section]: value })
    },
    [safe, onChange]
  )

  return (
    <div className="flex gap-6">
      {/* Tab Bar */}
      <div className="w-48 shrink-0 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right',
                isActive
                  ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-main)]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="flex-1 min-w-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'hero' && (
            <HeroSectionForm data={safe.hero} onChange={(v) => updateSection('hero', v)} />
          )}
          {activeTab === 'projects' && (
            <ProjectsSectionForm data={safe.projects} onChange={(v) => updateSection('projects', v)} />
          )}
          {activeTab === 'about' && (
            <AboutSectionForm data={safe.about} onChange={(v) => updateSection('about', v)} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsSectionForm data={safe.testimonials} onChange={(v) => updateSection('testimonials', v)} />
          )}
          {activeTab === 'faq' && (
            <FAQSectionForm data={safe.faqs} onChange={(v) => updateSection('faqs', v)} />
          )}
          {activeTab === 'partners' && (
            <PartnersSectionForm data={safe.partners} onChange={(v) => updateSection('partners', v)} />
          )}
          {activeTab === 'legal' && (
            <LegalFooterSectionForm data={safe.legal_footer} onChange={(v) => updateSection('legal_footer', v)} />
          )}
        </motion.div>
      </div>
    </div>
  )
}
