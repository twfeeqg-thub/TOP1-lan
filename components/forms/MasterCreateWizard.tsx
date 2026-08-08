'use client'

import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { GlassModal } from '@/components/ui/glass-modal'
import { DynamicForm } from './DynamicForm'
import type { FormSchema, SelectOption } from '@/lib/forms/types'

interface MasterCreateWizardProps {
  open: boolean
  onClose: () => void
  schema: FormSchema
  /** Runtime-injected select options keyed by field name (e.g. sectors). */
  fieldOptions?: Record<string, SelectOption[]>
  onCreated?: () => void
}

/**
 * Hosts a declarative FormSchema inside a GlassModal and runs the DynamicForm
 * wizard. On success it invalidates the schema's React Query caches so the
 * surrounding grids refresh automatically (no manual refresh buttons).
 */
export function MasterCreateWizard({ open, onClose, schema, fieldOptions, onCreated }: MasterCreateWizardProps) {
  const queryClient = useQueryClient()

  const effectiveSchema = useMemo<FormSchema>(() => {
    if (!fieldOptions) return schema
    return {
      ...schema,
      steps: schema.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => {
          const injected = fieldOptions[field.name]
          if (!injected || !field.options) return field
          return { ...field, options: [...injected, ...field.options] }
        }),
      })),
    }
  }, [schema, fieldOptions])

  const handleCreated = useCallback(() => {
    for (const key of effectiveSchema.invalidateKeys ?? []) {
      queryClient.invalidateQueries({ queryKey: [key] })
    }
    onCreated?.()
  }, [effectiveSchema, queryClient, onCreated])

  return (
    <GlassModal open={open} onClose={onClose} title={effectiveSchema.title}>
      <p className="mb-4 text-sm text-[var(--text-muted)]">{effectiveSchema.description}</p>
      <DynamicForm schema={effectiveSchema} onSuccess={handleCreated} onClose={onClose} />
    </GlassModal>
  )
}
