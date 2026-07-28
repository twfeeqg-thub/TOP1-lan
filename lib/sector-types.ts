export interface CTA {
  text: string
  href: string
}

export interface Hero {
  badge: string
  title: string
  description: string
  cta_primary: CTA
  cta_secondary: CTA
  cover_image: string
}

export interface Project {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  register_link: string
  login_link: string
  audience?: 'student' | 'professional'
  slug?: string
}

export interface Highlight {
  text: string
  icon: string
}

export interface About {
  title: string
  description: string
  highlights: Highlight[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface Partner {
  id: string
  name: string
  logo: string
}

export interface PolicyLink {
  label: string
  href: string
}

export interface LegalFooter {
  compliance_text: string
  meta_rights_text: string
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
