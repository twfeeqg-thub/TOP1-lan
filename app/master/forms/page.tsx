'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Grid3x3, AppWindow, Megaphone, Plus } from 'lucide-react'
import { MasterCreateWizard } from '@/components/forms/MasterCreateWizard'
import { sectorFormSchema } from '@/lib/forms/sector-schema'
import { projectFormSchema } from '@/lib/forms/project-schema'
import { adFormSchema } from '@/lib/forms/ad-schema'
import type { FormSchema, SelectOption } from '@/lib/forms/types'
import { cn } from '@/lib/utils'

interface SectorSummary {
  id: string
  name: string
  slug: string
}

async function fetchSectors(): Promise<{ data: SectorSummary[] }> {
  const res = await fetch('/api/master/sectors')
  if (!res.ok) throw new Error('Failed to fetch sectors')
  return res.json()
}

interface CreateCardDef {
  id: 'sector' | 'project' | 'ad'
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  accent: string
  schema: FormSchema
}

const CARDS: CreateCardDef[] = [
  {
    id: 'sector',
    icon: Grid3x3,
    title: 'قطاع جديد',
    description: 'أنشئ قطاعاً رقمياً يُعرض فوراً عبر القالب الزجاجي الديناميكي، ثم حرّر أقسامه السبعة التفصيلية.',
    accent: 'from-blue-500/20 to-cyan-500/10',
    schema: sectorFormSchema,
  },
  {
    id: 'project',
    icon: AppWindow,
    title: 'مشروع PWA',
    description: 'سجّل مشروعاً تطبيقياً واربطه بقطاع معيّن مع تهيئة JSONB متقدمة.',
    accent: 'from-violet-500/20 to-purple-500/10',
    schema: projectFormSchema,
  },
  {
    id: 'ad',
    icon: Megaphone,
    title: 'حملة إعلانية',
    description: 'أطلق إعلاناً جديداً داخل محرك الإعلانات السيادي بمواضع ومساحات عرض متعددة.',
    accent: 'from-rose-500/20 to-pink-500/10',
    schema: adFormSchema,
  },
]

export default function MasterFormsPage() {
  const [activeCard, setActiveCard] = useState<CreateCardDef | null>(null)

  const { data: sectorsData } = useQuery({
    queryKey: ['master-sectors'],
    queryFn: fetchSectors,
  })

  const sectorOptions: SelectOption[] = (sectorsData?.data ?? []).map((s) => ({
    label: s.name,
    value: s.name,
  }))

  const openWizard = useCallback((card: CreateCardDef) => {
    setActiveCard(card)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-[var(--text-main)]">إنشاء جديد</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          أنشئ قطاعاً أو مشروعاً أو حملة إعلانية عبر معالجات النماذج الموحّدة.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => openWizard(card)}
              className="glass-card group flex flex-col items-start gap-4 rounded-2xl p-6 text-right transition-all hover:border-[var(--primary)]"
            >
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br', card.accent)}>
                <Icon className="h-7 w-7 text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--text-main)]">{card.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{card.description}</p>
              </div>
              <span className="inline-flex min-h-[44px] touch-target items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all group-hover:bg-[var(--primary-hover)]">
                <Plus className="h-4 w-4" />
                إنشاء
              </span>
            </motion.button>
          )
        })}
      </div>

      {activeCard && (
        <MasterCreateWizard
          open={activeCard !== null}
          onClose={() => setActiveCard(null)}
          schema={activeCard.schema}
          fieldOptions={activeCard.id === 'project' ? { sector_name: sectorOptions } : undefined}
        />
      )}
    </div>
  )
}
