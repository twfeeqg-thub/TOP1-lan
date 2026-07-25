'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { About, Highlight } from '@/lib/sector-types'

interface AboutSectionFormProps {
  data: About
  onChange: (data: About) => void
}

export function AboutSectionForm({ data, onChange }: AboutSectionFormProps) {
  const addHighlight = () => {
    onChange({
      ...data,
      highlights: [...data.highlights, { text: '', icon: 'CheckCircle' }],
    })
  }

  const removeHighlight = (idx: number) => {
    onChange({
      ...data,
      highlights: data.highlights.filter((_, i) => i !== idx),
    })
  }

  const updateHighlight = (idx: number, field: keyof Highlight, value: string) => {
    onChange({
      ...data,
      highlights: data.highlights.map((h, i) =>
        i === idx ? { ...h, [field]: value } : h
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">العنوان</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الوصف</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--text-main)]">النقاط البارزة</label>
          <button
            onClick={addHighlight}
            className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> إضافة نقطة
          </button>
        </div>
        <div className="space-y-2">
          {data.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={h.text}
                onChange={(e) => updateHighlight(i, 'text', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="نص النقطة البارزة"
              />
              <input
                type="text"
                value={h.icon}
                onChange={(e) => updateHighlight(i, 'icon', e.target.value)}
                className="w-28 px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="الأيقونة"
              />
              <button
                onClick={() => removeHighlight(i)}
                className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
