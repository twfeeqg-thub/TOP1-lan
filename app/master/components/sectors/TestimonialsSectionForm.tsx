'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { Testimonial } from '@/lib/sector-types'

interface Props {
  data: Testimonial[]
  onChange: (data: Testimonial[]) => void
}

export function TestimonialsSectionForm({ data, onChange }: Props) {
  const safeData = data ?? []
  const addTestimonial = () => {
    const newItem: Testimonial = {
      id: `test-${Date.now()}`,
      name: '',
      role: '',
      content: '',
      avatar: '',
    }
    onChange([...safeData, newItem])
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    onChange(safeData.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const removeTestimonial = (id: string) => {
    onChange(safeData.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-4">
      {safeData.map((testimonial, ti) => (
        <div key={testimonial.id} className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-main)]">رأي {ti + 1}</span>
            <button
              onClick={() => removeTestimonial(testimonial.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">الاسم</label>
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">الدور/المنصب</label>
              <input
                type="text"
                value={testimonial.role}
                onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">المحتوى</label>
            <textarea
              value={testimonial.content}
              onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">الصورة الرمزية (رابط)</label>
            <input
              type="text"
              value={testimonial.avatar}
              onChange={(e) => updateTestimonial(testimonial.id, 'avatar', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addTestimonial}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة رأي جديد
      </button>
    </div>
  )
}
