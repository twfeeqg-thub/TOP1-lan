// ============================================================
// Unified Master Forms — declarative wizard schema system.
// A FormSchema describes a multi-step wizard purely with data:
// fields, validation hints, submit endpoint, and a transform.
// ============================================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'boolean'
  | 'date'
  | 'url'
  | 'password'
  | 'json'

export interface SelectOption {
  label: string
  value: string
}

export interface FieldSchema {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  hint?: string
  required?: boolean
  options?: SelectOption[]
  defaultValue?: unknown
  dir?: 'rtl' | 'ltr'
  min?: number
  max?: number
  step?: number
  rows?: number
  /** Optional validation expression evaluable on the field value. */
  validate?: (value: unknown, values: Record<string, unknown>) => string | null
  /** Display in a half-width grid cell on sm+ screens. */
  half?: boolean
}

export interface WizardStep {
  id: string
  title: string
  description?: string
  fields: FieldSchema[]
}

/**
 * Result of a single step's field validation.
 * Keyed by field name → Arabic error message (or null when valid).
 */
export type StepErrors = Record<string, string | null>

export interface FormSchema {
  id: string
  title: string
  description?: string
  steps: WizardStep[]
  submitLabel: string
  /** Endpoint receiving the final payload (POST). */
  endpoint: string
  /** Optional mapper from raw collected values → API body. */
  transform?: (values: Record<string, unknown>) => Record<string, unknown>
  /** Cache keys invalidated on success. */
  invalidateKeys?: string[]
}
