import { deepMerge } from './overrides-merge'

export interface CTA {
  text: string
  text_en?: string | null
  href: string
}

export interface Hero {
  badge: string
  badge_en?: string | null
  title: string
  title_en?: string | null
  description: string
  description_en?: string | null
  cta_primary: CTA
  cta_secondary: CTA
  cover_image: string
}

export interface Project {
  id: string
  name: string
  name_en?: string | null
  description: string
  description_en?: string | null
  icon: string
  features: string[]
  features_en?: string[] | null
  register_link: string
  login_link: string
  audience?: 'student' | 'professional'
  slug?: string
}

export interface Highlight {
  text: string
  text_en?: string | null
  icon: string
}

export interface About {
  title: string
  title_en?: string | null
  description: string
  description_en?: string | null
  highlights: Highlight[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  role_en?: string | null
  content: string
  content_en?: string | null
  avatar: string
}

export interface FAQ {
  id: string
  question: string
  question_en?: string | null
  answer: string
  answer_en?: string | null
}

export interface Partner {
  id: string
  name: string
  name_en?: string | null
  logo: string
}

export interface PolicyLink {
  label: string
  href: string
}

export interface LegalFooter {
  compliance_text: string
  compliance_text_en?: string | null
  meta_rights_text: string
  meta_rights_text_en?: string | null
  contact_email: string
  contact_phone: string
  contact_address: string
  policy_links: PolicyLink[]
}

export interface SectorData {
  hero: Hero
  projects: Project[]
  about: About
  testimonials: Testimonial[]
  faqs: FAQ[]
  partners: Partner[]
  legal_footer: LegalFooter
}

export interface SectorSummary {
  id: string
  name: string
  slug: string
  icon: string
  is_active: boolean
  created_at: string
}

export const defaultSectorData: SectorData = {
  hero: {
    badge: '',
    title: '',
    description: '',
    cta_primary: { text: '', href: '' },
    cta_secondary: { text: '', href: '' },
    cover_image: '',
  },
  projects: [],
  about: {
    title: '',
    description: '',
    highlights: [],
  },
  testimonials: [],
  faqs: [],
  partners: [],
  legal_footer: {
    compliance_text: '',
    meta_rights_text: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    policy_links: [],
  },
}

/**
 * Defensive form initializer: deep-merges a raw DB record (which may be an
 * empty `{}` JSONB for freshly seeded sectors) over `defaultSectorData` so the
 * 7-tab form never reads undefined sections. Null/undefined entries keep the
 * baseline; arrays are replaced wholesale.
 */
export function normalizeSectorData(record: Partial<SectorData> | null | undefined): SectorData {
  const merged = deepMerge(defaultSectorData as never, (record ?? {}) as never)
  return merged as unknown as SectorData
}
