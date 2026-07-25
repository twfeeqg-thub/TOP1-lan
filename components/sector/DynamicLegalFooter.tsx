import Link from 'next/link'
import type { LegalFooter } from '@/lib/sector-types'

export default function DynamicLegalFooter({ legal_footer }: { legal_footer: LegalFooter }) {
  if (!legal_footer) return null

  return (
    <footer
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ borderTop: '1px solid var(--card-border)' }}
    >
      <div className="glass-card rounded-2xl p-8 md:p-10 space-y-6">
        {legal_footer.compliance_text && (
          <div
            className="text-xs leading-relaxed text-center px-4 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--glow-color)',
              color: 'var(--text-muted)',
            }}
          >
            {legal_footer.compliance_text}
          </div>
        )}

        {legal_footer.meta_rights_text && (
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {legal_footer.meta_rights_text}
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

        {legal_footer.policy_links && legal_footer.policy_links.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {legal_footer.policy_links.map((link, idx) => (
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
      </div>
    </footer>
  )
}
