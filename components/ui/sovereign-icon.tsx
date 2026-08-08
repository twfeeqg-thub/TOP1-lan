'use client'

import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Stable dynamic icon resolver for the Layout Engine. Lookups index the full
 * lucide-react namespace on the module scope (never through a function call
 * during render), so any icon name stored in the database resolves at runtime
 * without creating a new component type inside the render flow — compliant
 * with the React Compiler's static-components analysis. Unknown names fall
 * back to FolderKanban.
 */
const ICON_LOOKUP = Icons as unknown as Record<string, LucideIcon>

export function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return Icons.FolderKanban
  return ICON_LOOKUP[name] ?? Icons.FolderKanban
}

export const FALLBACK_ICON: LucideIcon = Icons.FolderKanban

export interface SovereignIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name?: string | null
}

export function SovereignIcon({ name, ...props }: SovereignIconProps) {
  const Icon = name ? (ICON_LOOKUP[name] ?? Icons.FolderKanban) : Icons.FolderKanban
  return <Icon {...props} />
}

export type { LucideIcon }
