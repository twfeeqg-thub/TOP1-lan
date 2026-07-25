'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { FAQ } from '@/lib/sector-types'

interface FAQSectionFormProps {
  data: FAQ[]
  onChange: (data: FAQ[]) => void
}

export function FAQSectionForm({ data, onChange }: FAQSectionFormProps) {
  const addFAQ = () => {
    const newItem: FAQ = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    }
    onChange([...data, newItem])
  }

  const updateFAQ = (id: string, field: keyof FAQ, value: string) => {
    onChange(data.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const removeFAQ = (id: string) => {
    onChange(data.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((faq, fi) => (
        <div key={faq.id} className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-main)]">سؤال {fi + 1}</span>
            <button
              onClick={() => removeFAQ(faq.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">السؤال</label>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">الإجابة</label>
            <textarea
              value={faq.answer}
              onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addFAQ}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة سؤال جديد
      </button>
    </div>
  )
}
