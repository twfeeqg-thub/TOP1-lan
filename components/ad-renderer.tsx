'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AdCtaButton } from '@/components/ads/ad-cta-button'

export interface Ad {
  id: string
  ad_config: {
    title: string
    description: string
    targetUrl: string
    placement: 'top' | 'middle' | 'bottom'
    lang: 'ar' | 'en'
    is_fixed?: boolean
    is_exclusive?: boolean
  }
  media_url?: string
}

function buildFallbackAds(): Ad[] {
  return [
    {
      id: 'demo-ar-top', ad_config: {
        title: '🚀 منصة ذكاء سهل للتحول الرقمي',
        description: 'حلول سحابية سيادية متكاملة مع WhatsApp Business API. تواصل معنا لتفعيل قطاعك الرقمي اليوم.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'top', lang: 'ar',
      },
    },
    {
      id: 'demo-ar-middle', ad_config: {
        title: '💡 ذكاء سهل',
        description: 'اكتشف خدماتنا السحابية السيادية المتكاملة. قطاعك الرقمي ينتظرك.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'middle', lang: 'ar',
      },
    },
    {
      id: 'demo-ar-bottom', ad_config: {
        title: '🔐 منصة سحابية سيادية',
        description: 'حلول رقمية آمنة بالكامل مع تشفير متكامل للبيانات ومعايير Meta.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'bottom', lang: 'ar',
      },
    },
    {
      id: 'demo-en-top', ad_config: {
        title: '🚀 Easy Intellect Cloud Platform',
        description: 'Sovereign cloud solutions integrated with WhatsApp Business API. Activate your digital sector today.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'top', lang: 'en',
      },
    },
    {
      id: 'demo-en-middle', ad_config: {
        title: '💡 Easy Intellect',
        description: 'Discover our integrated sovereign cloud services. Your digital sector awaits you.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'middle', lang: 'en',
      },
    },
    {
      id: 'demo-en-bottom', ad_config: {
        title: '🔐 Sovereign Cloud Platform',
        description: 'Fully secure digital solutions with end-to-end encryption and Meta compliance.',
        targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
        placement: 'bottom', lang: 'en',
      },
    },
  ]
}

export const AD_FALLBACK: Ad[] = buildFallbackAds()

export const Ad_Renderer_Component = ({
  placement,
  lang,
  ads,
  isPremiumUser = false,
}: {
  placement: 'top' | 'middle' | 'bottom'
  lang: 'ar' | 'en'
  ads: Ad[]
  isPremiumUser?: boolean
}) => {
  const [killSwitchActive, setKillSwitchActive] = useState(false)
  const [killSwitchLoaded, setKillSwitchLoaded] = useState(false)
  const [mediaFailed, setMediaFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/master/ads/kill-switch')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setKillSwitchActive(json?.data?.active === true)
          setKillSwitchLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setKillSwitchLoaded(true)
        }
      })
    return () => { cancelled = true }
  }, [])

  const safeAds = Array.isArray(ads) ? ads : []
  let filteredAds = safeAds.filter(a => a?.ad_config?.placement === placement && a?.ad_config?.lang === lang)
  if (filteredAds.length === 0) {
    filteredAds = safeAds.filter(a => a?.ad_config?.lang === lang)
  }
  if (filteredAds.length === 0) {
    filteredAds = safeAds
  }

  const pinnedAd = filteredAds.find(a => a?.ad_config?.is_fixed || a?.ad_config?.is_exclusive)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isSlider = !pinnedAd && filteredAds.length > 1
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredAds.length)
    }, 5000)
  }, [filteredAds.length])

  useEffect(() => {
    if (!isSlider) return
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isSlider, startTimer])

  const navigateTo = useCallback((index: number) => {
    setCurrentIndex(index)
    if (isSlider) startTimer()
  }, [isSlider, startTimer])

  // Impression tracking — fires once per visible ad via the shared track route.
  // `useRef` guard keeps React StrictMode from double-counting the same ad.
  const trackedImpression = useRef<string | null>(null)
  const trackImpression = useCallback((adId: string) => {
    if (trackedImpression.current === adId) return
    trackedImpression.current = adId
    try {
      fetch('/api/ads/track', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_id: adId, action: 'impression' }),
      }).catch(() => undefined)
    } catch {
      /* analytics must never break rendering */
    }
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredAds.length)
    if (isSlider) startTimer()
  }, [isSlider, filteredAds.length, startTimer])

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredAds.length) % filteredAds.length)
    if (isSlider) startTimer()
  }, [isSlider, filteredAds.length, startTimer])

  const activeAdId = pinnedAd?.id ?? filteredAds[currentIndex]?.id

  // Impression tracking — fires once per visible ad via the shared track route.
  // `useRef` guard keeps React StrictMode from double-counting the same ad.
  useEffect(() => {
    if (!activeAdId) return
    trackImpression(activeAdId)
  }, [activeAdId, trackImpression])

  if (isPremiumUser) return null
  if (!killSwitchLoaded) return null
  if (killSwitchActive) return null

  if (filteredAds.length === 0) return null

  const ad = pinnedAd || filteredAds[currentIndex]
  const cfg = ad?.ad_config
  const mediaUrl = ad?.media_url
  const hasMedia = Boolean(mediaUrl)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 my-8" id={`ad-holder-${placement}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={ad.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 border-r-4 border-r-pink-500 dark:border-r-blue-500"
        >
          {isSlider && (
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all cursor-pointer touch-target"
              aria-label={lang === 'ar' ? 'السابق' : 'Previous'}
            >
              <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
          )}

          {isSlider && (
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all cursor-pointer touch-target"
              aria-label={lang === 'ar' ? 'التالي' : 'Next'}
            >
              <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
          )}

          <span className="absolute top-2 left-3 text-[9px] uppercase tracking-wider text-slate-400/80 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/10">
            {lang === 'ar' ? 'مساحة إعلانية مدمجة' : 'Central Ad Node'}
          </span>
          {hasMedia && !mediaFailed && (
            <div className="relative shrink-0 w-full md:w-48 aspect-[2/1] rounded-xl overflow-hidden bg-[var(--sidebar-hover-bg)]">
              <Image
                src={mediaUrl!}
                alt={cfg?.title ?? ''}
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                loading="lazy"
                decoding="async"
                className="object-cover"
                unoptimized
                onError={() => setMediaFailed(true)}
              />
            </div>
          )}
          <div className="text-right space-y-1 flex-1">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-500 dark:bg-blue-400 animate-pulse"></span>
              {cfg?.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {cfg?.description}
            </p>
          </div>
          {cfg?.targetUrl && (
            <button
              onClick={() => {
                try {
                  if (ad?.id) {
                    fetch('/api/ads/track', {
                      method: 'POST',
                      keepalive: true,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ad_id: ad.id, action: 'click' }),
                    }).catch(() => undefined)
                  }
                } catch {
                  /* analytics must never break navigation */
                }
                if (cfg.targetUrl.startsWith('http')) {
                  window.open(cfg.targetUrl, '_blank')
                } else {
                  const el = document.querySelector(cfg.targetUrl)
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="glass-button text-xs font-semibold py-2.5 px-5 rounded-xl border border-white/10 shadow-sm whitespace-nowrap cursor-pointer hover:bg-slate-500/10"
            >
              {lang === 'ar' ? 'زيارة العرض' : 'View Offer'}
            </button>
          )}

          {isSlider && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {filteredAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-pink-500 dark:bg-blue-400 w-3'
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={lang === 'ar' ? `الانتقال إلى الإعلان ${idx + 1}` : `Go to ad ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Generic "add your own ad" CTA — shown under every visible ad slot. */}
      <AdCtaButton lang={lang} />
    </div>
  )
}
