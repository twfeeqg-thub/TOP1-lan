'use client'

import { useCallback, useMemo, useState } from 'react'
import { Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { DynamicField } from './DynamicField'
import { cn } from '@/lib/utils'
import type { FieldSchema, FormSchema, StepErrors } from '@/lib/forms/types'

interface DynamicFormProps {
  schema: FormSchema
  onSuccess?: (data: unknown) => void
  onClose?: () => void
}

function collectDefaults(schema: FormSchema): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const step of schema.steps) {
    for (const field of step.fields) {
      values[field.name] = field.defaultValue ?? (field.type === 'boolean' ? false : '')
    }
  }
  return values
}

function validateStep(fields: FieldSchema[], values: Record<string, unknown>): StepErrors {
  const errors: StepErrors = {}
  for (const field of fields) {
    const raw = values[field.name]
    const isEmpty = raw === undefined || raw === null || raw === '' || (Array.isArray(raw) && raw.length === 0)
    if (field.required && isEmpty) {
      errors[field.name] = `${field.label} مطلوب`
      continue
    }
    if (!isEmpty && field.validate) {
      const message = field.validate(raw, values)
      if (message) errors[field.name] = message
    }
  }
  return errors
}

/**
 * Renders a declarative FormSchema as a multi-step wizard: per-step validation,
 * a transform hook before submission, and POST to the schema endpoint. On
 * success it invalidates the configured React Query caches and resets.
 */
export function DynamicForm({ schema, onSuccess, onClose }: DynamicFormProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, unknown>>(() => collectDefaults(schema))
  const [errors, setErrors] = useState<StepErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)

  const step = schema.steps[stepIndex]
  const isLastStep = stepIndex === schema.steps.length - 1

  const setField = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev))
  }, [])

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(step.fields, values)
    setErrors(stepErrors)
    if (Object.values(stepErrors).some(Boolean)) return
    setStepIndex((i) => Math.min(i + 1, schema.steps.length - 1))
    setSubmitError('')
  }, [step, values, schema.steps.length])

  const handleBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1))
    setErrors({})
  }, [])

  const payload = useMemo(() => {
    if (!schema.transform) return values
    return schema.transform(values)
  }, [schema, values])

  const handleSubmit = useCallback(async () => {
    const stepErrors = validateStep(step.fields, values)
    setErrors(stepErrors)
    if (Object.values(stepErrors).some(Boolean)) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(schema.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body?.error || 'فشل الحفظ، حاول مجدداً')
      }
      setDone(true)
      onSuccess?.(body)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'خطأ غير متوقع')
    } finally {
      setSubmitting(false)
    }
  }, [step, values, payload, schema.endpoint, onSuccess])

  const handleReset = useCallback(() => {
    setValues(collectDefaults(schema))
    setErrors({})
    setStepIndex(0)
    setSubmitError('')
    setDone(false)
  }, [schema])

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {schema.steps.map((s, i) => (
          <div key={s.id} className="flex-1">
            <div
              className={cn(
                'h-1.5 rounded-full transition-colors',
                i <= stepIndex ? 'bg-[var(--primary)]' : 'bg-[var(--sidebar-hover-bg)]'
              )}
            />
          </div>
        ))}
      </div>

      {done ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <p className="text-base font-bold text-[var(--text-main)]">تم الإنشاء بنجاح</p>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="min-h-[44px] touch-target rounded-xl glass-card px-4 text-sm font-medium hover:border-[var(--primary)] transition-all"
            >
              إنشاء آخر
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="min-h-[44px] touch-target rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">{step.title}</h3>
            {step.description && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{step.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {step.fields.map((field) => (
              <div key={field.name} className={field.half ? 'sm:col-span-1' : 'sm:col-span-2'}>
                <DynamicField
                  field={field}
                  value={values[field.name]}
                  onChange={(v) => setField(field.name, v)}
                  error={errors[field.name]}
                />
              </div>
            ))}
          </div>

          {submitError && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-400">{submitError}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={stepIndex > 0 ? handleBack : onClose}
              disabled={submitting}
              className="min-h-[44px] touch-target flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all disabled:opacity-50"
            >
              {stepIndex > 0 ? 'السابق' : 'إلغاء'}
            </button>
            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="min-h-[44px] touch-target flex-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'جاري الحفظ...' : schema.submitLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="min-h-[44px] touch-target flex-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)] flex items-center justify-center gap-1.5"
              >
                التالي
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
