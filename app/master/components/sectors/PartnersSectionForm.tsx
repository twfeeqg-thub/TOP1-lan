'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { Partner } from '@/lib/sector-types'

interface PartnersSectionFormProps {
  data: Partner[]
  onChange: (data: Partner[]) => void
}

export function PartnersSectionForm({ data, onChange }: PartnersSectionFormProps) {
  const addPartner = () => {
    const newItem: Partner = {
      id: `part-${Date.now()}`,
      name: '',
      logo: '',
    }
    onChange([...data, newItem])
  }

  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    onChange(data.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const removePartner = (id: string) => {
    onChange(data.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((partner, pi) => (
        <div key={partner.id} className="flex items-center gap-3 glass-card rounded-2xl p-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={partner.name}
              onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="اسم الشريك"
            />
            <input
              type="text"
              value={partner.logo}
              onChange={(e) => updatePartner(partner.id, 'logo', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="رابط الشعار"
            />
          </div>
          <button
            onClick={() => removePartner(partner.id)}
            className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addPartner}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة شريك جديد
      </button>
    </div>
  )
}
