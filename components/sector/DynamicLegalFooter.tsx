'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { LegalFooter } from '@/lib/sector-types'
import { resolveLangText } from '@/lib/i18n-sector'
import { useApp } from '@/app/providers'
import { usePsychMessage } from '@/hooks/use-psych-message'
import { farewellMessages } from '@/lib/psych-support'

export default function DynamicLegalFooter({ legal_footer }: { legal_footer: LegalFooter }) {
  const { lang } = useApp()
  const farewellMsg = usePsychMessage(farewellMessages)

  if (!legal_footer) return null

  const complianceText = resolveLangText(legal_footer.compliance_text, legal_footer.compliance_text_en, lang)
  const metaRightsText = resolveLangText(legal_footer.meta_rights_text, legal_footer.meta_rights_text_en, lang)
  const policyLinks = (legal_footer.policy_links ?? []).map((link) => ({
    ...link,
    label: resolveLangText(link.label, (link as { label_en?: string | null }).label_en, lang),
  }))

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ borderTop: '1px solid var(--card-border)' }}
    >
      <div className="glass-card rounded-2xl p-8 md:p-10 space-y-6">
        {complianceText && (
          <div
            className="text-xs leading-relaxed text-center px-4 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--glow-color)',
              color: 'var(--text-muted)',
            }}
          >
            {complianceText}
          </div>
        )}

        {metaRightsText && (
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {metaRightsText}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {legal_footer.contact_email && (
            <a href={`mailto:${legal_footer.contact_email}`} className="hover:underline">
              {legal_footer.contact_email}
            </a>
          )}
          {legal_footer.contact_phone && (
            <a href={`tel:${legal_footer.contact_phone}`} className="hover:underline" dir="ltr">
              {legal_footer.contact_phone}
            </a>
          )}
          {legal_footer.contact_address && (
            <span>{legal_footer.contact_address}</span>
          )}
        </div>

        {policyLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {policyLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-xs font-medium transition-all hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <p
          className="text-xs font-medium text-center pt-2"
          style={{ color: 'var(--primary)' }}
        >
          {farewellMsg}
        </p>
      </div>
    </motion.footer>
  )
}
