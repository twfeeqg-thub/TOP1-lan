import type { SectorData, Hero, Project, About, Testimonial, FAQ, Partner, LegalFooter } from './sector-types'

export type SectorLang = 'ar' | 'en'

/**
 * Bilingual JSONB resolver with safe automatic fallback.
 * English (when requested) falls back to the Arabic root if the `_en` field is
 * null/empty; Arabic renders the root directly. Never throws on missing data.
 */
export function resolveLangText(
  root: string | null | undefined,
  en: string | null | undefined,
  lang: SectorLang
): string {
  return lang === 'en' ? (en ?? root ?? '') : (root ?? '')
}

function resolveCta(cta: { text?: string | null; text_en?: string | null; href?: string } | undefined, lang: SectorLang) {
  return {
    text: resolveLangText(cta?.text, cta?.text_en, lang),
    href: cta?.href ?? '',
  }
}

function resolveHero(hero: Hero | undefined, lang: SectorLang) {
  return {
    ...hero,
    badge: resolveLangText(hero?.badge, hero?.badge_en, lang),
    title: resolveLangText(hero?.title, hero?.title_en, lang),
    description: resolveLangText(hero?.description, hero?.description_en, lang),
    cta_primary: hero?.cta_primary ? resolveCta(hero.cta_primary, lang) : undefined,
    cta_secondary: hero?.cta_secondary ? resolveCta(hero.cta_secondary, lang) : undefined,
  } as Hero
}

function resolveAbout(about: About | undefined, lang: SectorLang): About | undefined {
  if (!about) return undefined
  return {
    ...about,
    title: resolveLangText(about.title, about.title_en, lang),
    description: resolveLangText(about.description, about.description_en, lang),
    highlights: (about.highlights ?? []).map((h) => ({
      ...h,
      text: resolveLangText(h.text, h.text_en, lang),
    })),
  } as About
}

/**
 * Deep-resolves a stored sector document into the active language by folding
 * every `*_en` sibling over its Arabic root (Arabic used as the automatic
 * fallback whenever the English field is missing).
 */
export function resolveSectorForLang(data: SectorData, lang: SectorLang): SectorData {
  const projects: Project[] = (data.projects ?? []).map((p) => ({
    ...p,
    name: resolveLangText(p.name, p.name_en, lang),
    description: resolveLangText(p.description, p.description_en, lang),
    features: (p.features ?? []).map((f, i) =>
      resolveLangText(f, p.features_en?.[i], lang)
    ),
  }))

  const testimonials: Testimonial[] = (data.testimonials ?? []).map((t) => ({
    ...t,
    content: resolveLangText(t.content, t.content_en, lang),
    role: resolveLangText(t.role, t.role_en, lang),
  }))

  const faqs: FAQ[] = (data.faqs ?? []).map((f) => ({
    ...f,
    question: resolveLangText(f.question, f.question_en, lang),
    answer: resolveLangText(f.answer, f.answer_en, lang),
  }))

  const partners: Partner[] = (data.partners ?? []).map((p) => ({
    ...p,
    name: resolveLangText(p.name, p.name_en, lang),
  }))

  const legal: LegalFooter | undefined = data.legal_footer
    ? {
        ...data.legal_footer,
        compliance_text: resolveLangText(data.legal_footer.compliance_text, data.legal_footer.compliance_text_en, lang),
        meta_rights_text: resolveLangText(data.legal_footer.meta_rights_text, data.legal_footer.meta_rights_text_en, lang),
      }
    : undefined

  return {
    ...data,
    hero: resolveHero(data.hero, lang),
    projects,
    about: resolveAbout(data.about, lang) ?? (data.about as About),
    testimonials,
    faqs,
    partners,
    legal_footer: legal ?? (data.legal_footer as LegalFooter),
  }
}
