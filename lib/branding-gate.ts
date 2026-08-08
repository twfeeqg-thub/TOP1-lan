import type { AuthRole } from '@/lib/auth'

export type BrandAssetType = 'logo' | 'favicon' | 'pwa_icon'

export interface BrandingGateOptions {
  /** The authenticated user's role (from the session, never client claims). */
  role: AuthRole | string | null | undefined
  /** Compiled flag from `modules_config.feature.branding.custom_upload`. */
  customUploadFlag?: boolean | null | undefined
}

/**
 * Tier-based branding gate.
 *
 * - Platform staff (`super_admin`, `master`) → always allowed (global images
 *   via /master/settings).
 * - tenant/client admins → allowed ONLY when `custom_upload` is enabled for
 *   their project (`modules_config.feature.branding.custom_upload === true`).
 */
export function canUploadBranding({ role, customUploadFlag }: BrandingGateOptions): boolean {
  if (role === 'super_admin' || role === 'master') return true
  if (customUploadFlag === true) return true
  return false
}
