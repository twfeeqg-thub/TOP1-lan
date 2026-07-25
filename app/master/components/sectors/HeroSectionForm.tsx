'use client'

import type { Hero } from '@/lib/sector-types'

interface HeroSectionFormProps {
  data: Hero
  onChange: (data: Hero) => void
}

export function HeroSectionForm({ data, onChange }: HeroSectionFormProps) {
  const update = (field: keyof Hero, value: string | { text: string; href: string }) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الشارة (Badge)</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => update('badge', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          placeholder="مثال: المنصة التعليمية الرائدة"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">العنوان الرئيسي</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الوصف</label>
        <textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-main)]">زر CTA الأساسي — النص</label>
          <input
            type="text"
            value={data.cta_primary.text}
            onChange={(e) => update('cta_primary', { ...data.cta_primary, text: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <label className="block text-sm font-medium text-[var(--text-main)]">زر CTA الأساسي — الرابط</label>
          <input
            type="text"
            value={data.cta_primary.href}
            onChange={(e) => update('cta_primary', { ...data.cta_primary, href: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-main)]">زر CTA الثانوي — النص</label>
          <input
            type="text"
            value={data.cta_secondary.text}
            onChange={(e) => update('cta_secondary', { ...data.cta_secondary, text: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <label className="block text-sm font-medium text-[var(--text-main)]">زر CTA الثانوي — الرابط</label>
          <input
            type="text"
            value={data.cta_secondary.href}
            onChange={(e) => update('cta_secondary', { ...data.cta_secondary, href: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">صورة الغلاف (رابط)</label>
        <input
          type="text"
          value={data.cover_image}
          onChange={(e) => update('cover_image', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          placeholder="/assets/hero.jpg"
        />
      </div>
    </div>
  )
}
