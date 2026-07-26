import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getSectorData } from '@/lib/get-sector-data'
import { DynamicHero, DynamicProjects, DynamicAbout, DynamicPartners, DynamicLegalFooter, FallbackBanner } from '@/components/sector'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DynamicTestimonials = dynamic(() => import('@/components/sector/DynamicTestimonials'), { ssr: true })
const DynamicFAQ = dynamic(() => import('@/components/sector/DynamicFAQ'), { ssr: true })
const Ad_Renderer_Component = dynamic(() => import('@/components/ad-renderer').then((m) => ({ default: m.Ad_Renderer_Component })), { ssr: true })

export default async function SectorPage({ params }: { params: Promise<{ sector_slug: string }> }) {
  const { sector_slug } = await params
  const { data, isFallback } = await getSectorData(sector_slug)

  if (!data) notFound()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-main)' }}>
      <nav
        className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ backdropFilter: 'blur(var(--glass-blur))' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </nav>

      <div className="h-16" />

      {isFallback && <FallbackBanner />}

      <DynamicHero hero={data.hero} />

      <Suspense fallback={null}>
        <Ad_Renderer_Component placement="top" lang="ar" ads={[]} />
      </Suspense>

      <DynamicProjects projects={data.projects} />

      <Suspense fallback={null}>
        <Ad_Renderer_Component placement="middle" lang="ar" ads={[]} />
      </Suspense>

      <DynamicAbout about={data.about} />
      <DynamicTestimonials testimonials={data.testimonials} />
      <DynamicFAQ faqs={data.faqs} />
      <DynamicPartners partners={data.partners} />

      <Suspense fallback={null}>
        <Ad_Renderer_Component placement="bottom" lang="ar" ads={[]} />
      </Suspense>

      <DynamicLegalFooter legal_footer={data.legal_footer} />
    </div>
  )
}
