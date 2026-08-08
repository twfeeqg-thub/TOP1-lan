'use client';

import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';

/**
 * Shared glassmorphic form controls for the client customizer.
 * All interactive elements carry the `.touch-target` class so the guaranteed
 * hit area stays ≥ 44×44px (mobile-first guideline).
 */

interface LabelProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

function Field({ label, hint, children }: LabelProps) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-bold text-[var(--text-main)]">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] text-[var(--text-muted)]">{hint}</span> : null}
    </label>
  );
}

const INPUT_CLASS =
  'glass-input touch-target w-full min-h-[44px] px-3.5 rounded-xl text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60';

export function TextInput({
  label,
  hint,
  dir,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; dir?: 'rtl' | 'ltr' }) {
  return (
    <Field label={label} hint={hint}>
      <input {...props} dir={dir ?? 'rtl'} className={INPUT_CLASS} />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  rows = 4,
  dir,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; dir?: 'rtl' | 'ltr' }) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        {...props}
        rows={rows}
        dir={dir ?? 'rtl'}
        className={`${INPUT_CLASS} resize-none py-3`}
      />
    </Field>
  );
}

export function SelectField({
  label,
  hint,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  options: { label: string; value: string }[];
}) {
  return (
    <Field label={label} hint={hint}>
      <select {...props} className={INPUT_CLASS}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} — picker`}
          value={/^#[0-9a-fA-F]{6}$/.test(value ?? '') ? (value as string) : '#2563eb'}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer touch-target rounded-xl border border-white/10 bg-transparent p-1"
        />
        <input
          type="text"
          dir="ltr"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#2563eb"
          className={INPUT_CLASS}
        />
      </div>
    </Field>
  );
}