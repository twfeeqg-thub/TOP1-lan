'use client'

import { cn } from '@/lib/utils'
import type { FieldSchema } from '@/lib/forms/types'

interface DynamicFieldProps {
  field: FieldSchema
  value: unknown
  onChange: (value: unknown) => void
  error?: string | null
}

/**
 * Renders a single declarative field from a FieldSchema. Handles text,
 * textarea, select, number, boolean, date, url, password and json inputs
 * with mobile-first 44px touch targets and the glassmorphic input system.
 */
export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const inputClass = cn(
    'glass-input w-full rounded-xl px-4 py-3 text-sm outline-none',
    'min-h-[44px] touch-target',
    field.dir === 'ltr' && 'dir-ltr text-left',
    error && 'border-rose-500/60'
  )

  const renderControl = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows ?? 4}
            dir={field.dir ?? 'auto'}
            className={cn(inputClass, 'resize-none leading-relaxed')}
          />
        )

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows ?? 5}
            dir={field.dir ?? 'ltr'}
            spellCheck={false}
            className={cn(inputClass, 'resize-none leading-relaxed font-mono text-xs')}
          />
        )

      case 'select':
        return (
          <select
            value={typeof value === 'string' ? value : (field.defaultValue as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, 'appearance-none cursor-pointer')}
          >
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'boolean':
        return (
          <label className="flex min-h-[44px] cursor-pointer select-none items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2.5">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="h-5 w-5 accent-[var(--primary)]"
            />
            <span className="text-sm text-[var(--text-main)]">{field.label}</span>
          </label>
        )

      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={inputClass}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        )

      case 'url':
      case 'password':
      case 'text':
      default:
        return (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'password' ? 'password' : 'text'}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            dir={field.dir ?? 'auto'}
            className={inputClass}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5">
      {field.type !== 'boolean' && (
        <label className="block text-sm font-medium text-[var(--text-muted)]">
          {field.label}
          {field.required && <span className="text-rose-400"> *</span>}
        </label>
      )}
      {renderControl()}
      {field.hint && !error && (
        <p className="text-xs text-[var(--text-muted)]/70">{field.hint}</p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
