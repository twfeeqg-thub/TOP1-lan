'use client'

import { useState } from 'react'
import { ClientAdRequestModal } from '@/components/ads/client-ad-request-modal'

export type AdCtaLang = 'ar' | 'en'

const COPY: Record<AdCtaLang, string> = {
  ar: 'اضغط هنا لإضافة إعلانك الخاص',
  en: 'Click here to add your own ad',
}

export interface AdCtaButtonProps {
  lang?: AdCtaLang
  /** When provided, the parent controls the modal instead of internal state. */
  open?: boolean
  onOpenRequest?: () => void
  onCloseRequest?: () => void
}

/**
 * Generic "add your own ad" CTA. Used inline inside `Ad_Renderer_Component`
 * so it appears under every ad slot (top / middle / bottom). Hidden for
 * premium users / kill-switch is handled by the renderer, matching the ad block.
 */
export function AdCtaButton({ lang = 'ar', open, onOpenRequest, onCloseRequest }: AdCtaButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? open : internalOpen

  const openModal = () => {
    if (isControlled) {
      onOpenRequest?.()
    } else {
      setInternalOpen(true)
    }
  }

  const closeModal = () => {
    if (isControlled) {
      onCloseRequest?.()
    } else {
      setInternalOpen(false)
    }
  }

  return (
    <>
      <div className="flex justify-center -mt-4 mb-2">
        <button
          type="button"
          onClick={openModal}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors underline underline-offset-4 decoration-dotted decoration-[var(--text-muted)]/30 hover:decoration-[var(--primary)]/50"
        >
          {COPY[lang] ?? COPY.ar}
        </button>
      </div>
      <ClientAdRequestModal open={isOpen} onClose={closeModal} />
    </>
  )
}

export default AdCtaButton
