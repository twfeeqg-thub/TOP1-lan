'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LegalFooter, PolicyLink } from '@/lib/sector-types'

interface LegalFooterSectionFormProps {
  data: LegalFooter
  onChange: (data: LegalFooter) => void
}

export function LegalFooterSectionForm({ data, onChange }: LegalFooterSectionFormProps) {
  const policy_links = data?.policy_links ?? []

  const addPolicyLink = () => {
    onChange({
      ...data,
      policy_links: [...policy_links, { label: '', href: '' }],
    })
  }

  const updatePolicyLink = (idx: number, field: keyof PolicyLink, value: string) => {
    onChange({
      ...data,
      policy_links: policy_links.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      ),
    })
  }

  const removePolicyLink = (idx: number) => {
    onChange({
      ...data,
      policy_links: policy_links.filter((_, i) => i !== idx),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">نص الامتثال</label>
        <textarea
          value={data?.compliance_text ?? ''}
          onChange={(e) => onChange({ ...data, compliance_text: e.target.value })}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">نص حقوق Meta</label>
        <textarea
          value={data?.meta_rights_text ?? ''}
          onChange={(e) => onChange({ ...data, meta_rights_text: e.target.value })}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الإيميل</label>
          <input
            type="email"
            value={data?.contact_email ?? ''}
            onChange={(e) => onChange({ ...data, contact_email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">الهاتف</label>
          <input
            type="text"
            value={data?.contact_phone ?? ''}
            onChange={(e) => onChange({ ...data, contact_phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">العنوان</label>
          <input
            type="text"
            value={data?.contact_address ?? ''}
            onChange={(e) => onChange({ ...data, contact_address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--text-main)]">روابط السياسات</label>
          <button
            onClick={addPolicyLink}
            className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> إضافة رابط
          </button>
        </div>
        <div className="space-y-2">
          {policy_links.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updatePolicyLink(i, 'label', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="اسم السياسة"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updatePolicyLink(i, 'href', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="/privacy"
              />
              <button
                onClick={() => removePolicyLink(i)}
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
