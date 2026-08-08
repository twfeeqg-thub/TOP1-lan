/**
 * Icon facade for the sovereign platform. Re-exports the stable dynamic icon
 * resolver and the `<SovereignIcon>` component. Any lucide icon name stored in
 * the database resolves at runtime; unknown names fall back to FolderKanban.
 */
export {
  resolveIcon,
  FALLBACK_ICON,
  SovereignIcon,
  type SovereignIconProps,
} from '@/components/ui/sovereign-icon'
export type { LucideIcon } from '@/components/ui/sovereign-icon'
