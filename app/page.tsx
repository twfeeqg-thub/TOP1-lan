'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  HeartPulse,
  Building2,
  ShoppingBag,
  Sun,
  Moon,
  Palette,
  Globe,
  Send,
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ArrowLeftRight,
  Sparkles,
  Layers,
  MessageSquare,
  Building,
  Briefcase
} from 'lucide-react';
import { useApp } from './providers';
import { useProjects, useAds } from '@/hooks/use-projects';
import { clearCache } from '@/lib/db';
import { Ad_Renderer_Component, AD_FALLBACK, type Ad } from '@/components/ad-renderer';
import { ClientAdRequestModal } from '@/components/ads/client-ad-request-modal';

// ==========================================
// 1. UI TEXT CONFIGURATION (PRESENTATION ONLY - NO MOCK DATA)
// ==========================================

const UI_TEXT = {
  ar: {
    meta: {
      title: "ذكاء سهل",
      subtitle: "بوابة التحول الرقمي السيادي المتكامل",
      headline: "بوابتك السحابية الآمنة لتمكين قطاعات الدولة والمؤسسات",
      description: "حلول رقمية مترابطة وبنية تحتية سحابية مستقلة متوافقة بالكامل مع بروتوكولات الأمان والمعايير المعتمدة لشركة Meta لتقديم خدمات WhatsApp للأعمال.",
      sovereignBadge: "منصة وطنية سيادية معتمدة للتحول الرقمي",
      metaVerificationText: "شريك تقني معتمد لحلول WhatsApp Business API. نلتزم بكافة ضوابط سياسات Meta للاستخدام العادل وحماية وتشفير البيانات السيادية.",
      businessInfo: {
        registeredName: "مؤسسة ذكاء سهل لتقنية المعلومات والحلول الرقمية",
        licenseNumber: "رقم السجل التجاري الموحد: 1010729352",
        address: "المنطقة الرقمية المركزية، الرياض، المملكة العربية السعودية",
      }
    },
    cta: {
      primaryText: "تصفح المشاريع المفعّلة",
      secondaryText: "تفاصيل بروتوكول Meta والأمان",
    },
    stats: [
      { value: "100%", label: "سيادة وتشفير كامل للبيانات" },
      { value: "4 قطاعات", label: "بنية تحتية موحدة سحابياً" },
      { value: "Meta Partner", label: "تكامل مباشر مع WhatsApp API" },
    ],
    sectorsTitle: "القطاعات الرقمية الموحدة",
    sectorsSubtitle: "تكامل خدماتنا السحابية لتحقيق قفزة نوعية في تسيير أعمالك بكفاءة وأمان رقمي متكامل.",
    modal: {
      title: "القطاع قيد التحضير والإنشاء",
      description: "نحن نعمل جاهدين بالتعاون مع شركائنا التقنيين لتجهيز هذا القطاع الرقمي بأعلى معايير الأمان.",
      motivation: "نحب أن نسمع صوتك! شاركنا رؤيتك الفريدة ومقترحاتك حول ما تطمح لرؤيته في هذا القطاع السحابي لتلبي احتياجاتك.",
      placeholderSuggestion: "يرجى كتابة أفكارك ومقترحاتك هنا...",
      placeholderContact: "البريد الإلكتروني أو رقم الهاتف لغرض التواصل الإخباري...",
      contactLabel: "وسيلة التواصل لإبلاغك بأحدث التطورات:",
      submitBtn: "إرسال المقترحات للتطوير",
      submittingBtn: "جاري تأمين الإرسال...",
      successTitle: "تم استلام أفكارك بنجاح!",
      successDesc: "شكراً لمساهمتك البنّاءة في تصميم مستقبل التحول الرقمي السيادي. سنقوم بالتواصل معك بمجرد إتاحة الخدمة وتفعيل القطاع.",
      closeBtn: "إغلاق",
    },
    legal: {
      copyright: "جميع الحقوق محفوظة © ٢٠٢٦ منصة ذكاء سهل للخدمات الرقمية السحابية.",
      metaDisclaimer: "ملاحظة قانونية: WhatsApp Business API هي علامة تجارية مسجلة لشركة Meta Platforms, Inc. استخدامها في هذه المنصة يخضع لشروط الاستخدام وسياسات الخصوصية المعتمدة لشركة Meta.",
      links: [
        { id: "privacy", text: "سياسة الخصوصية وحماية البيانات", title: "سياسة الخصوصية وحماية البيانات", content: "تلتزم منصة ذكاء سهل بحفظ خصوصية وتشفير كافة البيانات الخاصة بالمستخدمين والمؤسسات، متطابقة مع ضوابط حوكمة البيانات الوطنية ومقاييس الأمان لدى Meta." },
        { id: "terms", text: "شروط الاستخدام والأمان السيادي", title: "شروط الاستخدام والأمان السيادي", content: "تخضع كافة المعاملات البرمجية والخدمات السحابية عبر ذكاء سهل لشروط الاستخدام السيادية التي تمنع الاستغلال غير المصرح به وتدعم تكامل الأنظمة بكفاءة." },
        { id: "meta-compliance", text: "دليل الامتثال لسياسات Meta", title: "دليل الامتثال لسياسات Meta", content: "تمت مراجعة المنصة والتأكد من مطابقتها لسياسات Meta Business Verification وشروط WhatsApp Business API للاستخدام العادل والتواصل المؤسسي الآمن." },
        { id: "business-license", text: "السجل والترخيص التجاري", title: "بيانات التراخيص والنشاط التجاري", content: "المنصة تدار بموجب السجل التجاري رقم: 1010729352 لـ (مؤسسة ذكاء سهل لتقنية المعلومات والحلول الرقمية) المرخصة رسمياً في المملكة العربية السعودية." }
      ]
    }
  },
  en: {
    meta: {
      title: "Easy Intellect",
      subtitle: "The Sovereign Unified Digital Portal",
      headline: "Your Secure Cloud Portal for State Sectors & Digital Enterprises",
      description: "Connected digital solutions and sovereign independent cloud infrastructure fully compliant with Meta security protocols and standards for WhatsApp Business API services.",
      sovereignBadge: "Certified National Sovereign Digital Platform",
      metaVerificationText: "Certified technical partner for WhatsApp Business API. Fully committed to Meta's privacy policies and national data encryption protocols.",
      businessInfo: {
        registeredName: "Easy Intellect Enterprise for Information Technology",
        licenseNumber: "Unified Commercial Registration ID: 1010729352",
        address: "Central Digital District, Riyadh, Kingdom of Saudi Arabia",
      }
    },
    cta: {
      primaryText: "Browse Active Projects",
      secondaryText: "Meta Protocol & Security Details",
    },
    stats: [
      { value: "100%", label: "Data Sovereignty & Encryption" },
      { value: "4 Sectors", label: "Unified Cloud Infrastructure" },
      { value: "Meta Partner", label: "Direct WhatsApp API Integration" },
    ],
    sectorsTitle: "Unified Digital Sectors",
    sectorsSubtitle: "Seamlessly integrate our cloud services to achieve a qualitative leap in your business operations with absolute digital efficiency and safety.",
    modal: {
      title: "Sector is Under Construction",
      description: "We are working hard with our technical partners to launch this digital sector meeting the highest standards of safety.",
      motivation: "We would love to hear your voice! Share your unique vision and suggestions for what you hope to see in this cloud sector.",
      placeholderSuggestion: "Please type your ideas and suggestions here...",
      placeholderContact: "Email or phone number for update notifications...",
      contactLabel: "Contact method to inform you about updates:",
      submitBtn: "Submit Suggestions",
      submittingBtn: "Securing Submission...",
      successTitle: "Suggestions Received!",
      successDesc: "Thank you for your constructive contribution in shaping the future of sovereign digital transformation. We will contact you once the sector is active.",
      closeBtn: "Close",
    },
    legal: {
      copyright: "All rights reserved © 2026 Easy Intellect Cloud Digital Services.",
      metaDisclaimer: "Legal Notice: WhatsApp Business API is a registered trademark of Meta Platforms, Inc. Usage within this platform is governed by Meta's approved terms of service and privacy rules.",
      links: [
        { id: "privacy", text: "Privacy Policy & Data Shield", title: "Privacy Policy & Data Shield", content: "Easy Intellect is committed to protecting the privacy and encryption of all user and institutional data, complying with national data governance guidelines and Meta security parameters." },
        { id: "terms", text: "Sovereign Terms of Service", title: "Sovereign Terms of Service", content: "All software operations and cloud services via Easy Intellect are subject to sovereign terms of service that prevent unauthorized exploitation and ensure secure system integration." },
        { id: "meta-compliance", text: "Meta Compliance Guidelines", title: "Meta Compliance Guidelines", content: "The platform has been audited and verified compliant with Meta Business Verification rules and WhatsApp Business API terms for institutional communications." },
        { id: "business-license", text: "Commercial Registry & License", title: "Licensing & Commercial Information", content: "The platform is operated under commercial license registration ID: 1010729352 for (Easy Intellect Enterprise for Information Technology) officially registered in Saudi Arabia." }
      ]
    }
  }
};

// ==========================================
// 2. SECTOR METADATA (IDENTITY & PRESENTATION - STATIC)
// ==========================================

const SECTOR_META: {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  linkUrl?: string;
}[] = [
  {
    id: 'education',
    nameAr: 'قطاع التعليم الرقمي',
    nameEn: 'Digital Education Sector',
    descriptionAr: 'حلول ذكية لتمكين الكادر التعليمي والطلاب من خلال فضاءات تعليمية سحابية متكاملة وسهلة الاستخدام.',
    descriptionEn: 'Smart solutions empowering educators and students through integrated, easy-to-use cloud environments.',
    iconName: 'GraduationCap',
    linkUrl: '/education',
  },
  {
    id: 'health',
    nameAr: 'قطاع الرعاية الصحية الذكية',
    nameEn: 'Smart Healthcare Sector',
    descriptionAr: 'بوابات صحية موحدة تساهم في تسريع التحول الرقمي الطبي وتسهيل تتبع السجلات والخدمات العلاجية.',
    descriptionEn: 'Unified health portals driving digital transformation and medical record tracking securely.',
    iconName: 'HeartPulse',
  },
  {
    id: 'real-estate',
    nameAr: 'قطاع العقارات والمباني السيادية',
    nameEn: 'Sovereign Real Estate Sector',
    descriptionAr: 'أنظمة ذكية لإدارة وتتبع الأصول العقارية والملكيات وتوثيق البيانات بنظام عقاري متكامل وعالي الأمان.',
    descriptionEn: 'Intelligent systems for tracking property registry assets and secure real estate transactions.',
    iconName: 'Building2',
  },
  {
    id: 'commerce',
    nameAr: 'قطاع التجارة والأعمال المترابطة',
    nameEn: 'Unified Commerce Sector',
    descriptionAr: 'منصات تجارية سحابية لربط المتاجر وإدارة المبيعات وسلاسل التوريد مع الدعم المتكامل لعمليات الدفع.',
    descriptionEn: 'Sovereign cloud commerce platforms linking merchants and supply chains with integrated payment gateways.',
    iconName: 'ShoppingBag',
  },
];

// ==========================================
// 3. ADS FALLBACK (EMPTY - LAST RESORT)
// ==========================================



// ==========================================
// 4. SECTOR-PROJECT MAPPING HELPER
// ==========================================

const SECTOR_KEYWORDS: Record<string, string[]> = {
  education: ['تعليمي', 'edu_'],
  health: ['صحي', 'health_'],
  'real-estate': ['عقاري', 'real_estate_'],
  commerce: ['تجاري', 'commerce_'],
};

function mapProjectToSectorId(project: { sector_name?: string; project_slug?: string }): string | null {
  for (const [sectorId, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    for (const kw of keywords) {
      if (project.sector_name?.includes(kw)) return sectorId;
      if (project.project_slug?.startsWith(kw)) return sectorId;
    }
  }
  return null;
}

export default function LandingPage() {
  const { theme, lang, toggleTheme, toggleLang } = useApp();

  const { data: projects = [] } = useProjects();
  const { data: adsRaw } = useAds();
  const ads = Array.isArray(adsRaw) && adsRaw.length > 0 ? adsRaw : AD_FALLBACK;

  // Modal Interaction States
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Legal Popups Modal State
  const [activeLegalModal, setActiveLegalModal] = useState<{title: string, content: string} | null>(null);
  const [adRequestModal, setAdRequestModal] = useState(false);

  // Derive sectors from SECTOR_META + Supabase project data
  const sectors = SECTOR_META.map(meta => {
    const sectorProjects = projects.filter((p: Record<string, unknown>) => mapProjectToSectorId(p as any) === meta.id);
    const isActive = sectorProjects.some((p: Record<string, unknown>) => (p as any).is_active === true);
    return {
      id: meta.id,
      name: lang === 'ar' ? meta.nameAr : meta.nameEn,
      description: lang === 'ar' ? meta.descriptionAr : meta.descriptionEn,
      iconName: meta.iconName,
      isActive,
      linkUrl: meta.linkUrl || null,
      statusBadge: isActive
        ? (lang === 'ar' ? 'مفعّل ونشط' : 'Active & Live')
        : (lang === 'ar' ? 'قيد التطوير' : 'Under Development'),
    };
  });

  // Handle Sector Actions
  const handleSectorClick = (sector: any) => {
    if (sector.isActive && sector.linkUrl) {
      window.location.href = sector.linkUrl;
    } else {
      setSelectedSector(sector);
      setSuggestion('');
      setContact('');
      setIsSubmitted(false);
      setIsModalOpen(true);
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      const currentSubmissions = JSON.parse(localStorage.getItem('sector_suggestions') || '[]');
      currentSubmissions.push({
        sectorId: selectedSector.id,
        sectorName: selectedSector.name,
        suggestion,
        contact,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('sector_suggestions', JSON.stringify(currentSubmissions));
    }, 1200);
  };

  const currentCopy = UI_TEXT[lang];

  const renderSectorIcon = (iconName: string) => {
    const iconProps = { className: "w-8 h-8 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" };
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />;
      case 'HeartPulse':
        return <HeartPulse {...iconProps} />;
      case 'Building2':
        return <Building2 {...iconProps} />;
      case 'ShoppingBag':
        return <ShoppingBag {...iconProps} />;
      default:
        return <Layers {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">

      {/* Background Glows for Sovereign Aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 dark:bg-pink-600/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>

      {/* ==========================================
          HEADER SECTION
         ========================================== */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 md:py-4 transition-all duration-300" id="main-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5" id="brand-logo">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5.5 h-5.5 text-white animate-float" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {currentCopy.meta.title}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {currentCopy.meta.subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 md:gap-4" id="header-controls">

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => toggleLang(lang === 'ar' ? 'en' : 'ar')}
              className="glass-button text-xs py-2 px-3 md:px-4 rounded-xl flex items-center gap-2 font-semibold hover:bg-slate-500/10 transition-colors"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dynamic Theme Switcher */}
            <div className="flex items-center bg-slate-500/10 p-1.5 rounded-2xl border border-white/5" id="theme-selectors-container">
              <button
                id="theme-btn-light"
                onClick={() => toggleTheme('light')}
                className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-400 hover:text-slate-100'}`}
                title="Light Theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                id="theme-btn-dark"
                onClick={() => toggleTheme('dark')}
                className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-md scale-105' : 'text-slate-400 hover:text-slate-100'}`}
                title="Dark Theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                id="theme-btn-pink"
                onClick={() => toggleTheme('pink')}
                className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'pink' ? 'bg-pink-500 text-white shadow-md scale-105' : 'text-pink-400 hover:text-pink-100'}`}
                title="Pink Theme"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ==========================================
          HERO SECTION
         ========================================== */}
      <section className="relative px-4 py-16 md:py-24 text-center overflow-hidden" id="hero-section">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Certified sovereign badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wide animate-float" id="sovereign-badge">
            <span className="w-2 py-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{currentCopy.meta.sovereignBadge}</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight md:leading-none text-slate-900 dark:text-white" id="main-headline">
              {currentCopy.meta.headline}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed" id="main-description">
              {currentCopy.meta.description}
            </p>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" id="hero-actions">
            <button
              onClick={() => {
                const el = document.getElementById('sectors-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02]"
              id="cta-primary-btn"
            >
              {currentCopy.cta.primaryText}
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('meta-compliance-info');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-button text-sm font-extrabold border border-white/10 hover:bg-slate-500/10 transition-all hover:scale-[1.02]"
              id="cta-secondary-btn"
            >
              {currentCopy.cta.secondaryText}
            </button>
          </div>

          {/* Stats matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-10" id="stats-grid">
            {currentCopy.stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl text-center border-white/5 bg-slate-500/5 hover:border-blue-500/30"
                id={`stat-card-${idx}`}
              >
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Injection Area for Central Ads (Top Placement) - Pulls from ads_engine via Supabase */}
      <Ad_Renderer_Component placement="top" lang={lang} ads={ads} />
      <div className="flex justify-center -mt-4 mb-2">
        <button
          onClick={() => setAdRequestModal(true)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors underline underline-offset-4 decoration-dotted decoration-[var(--text-muted)]/30 hover:decoration-[var(--primary)]/50"
        >
          أضغط هنا لإضافة إعلانك الخاص
        </button>
      </div>

      {/* ==========================================
          SECTORS SECTION - DYNAMIC FROM SUPABASE
         ========================================== */}
      <section className="px-4 py-16 md:py-20 relative bg-slate-500/[0.02] border-y border-slate-500/5" id="sectors-section">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white" id="sectors-section-title">
              {currentCopy.sectorsTitle}
            </h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed" id="sectors-section-subtitle">
              {currentCopy.sectorsSubtitle}
            </p>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="sectors-grid-container">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className={`glass-card p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 relative border-white/5 bg-slate-500/5 ${sector.isActive ? 'ring-2 ring-blue-500/30' : ''}`}
                id={`sector-card-${sector.id}`}
              >
                {/* Active Indicator Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${sector.isActive ? 'bg-green-500/15 text-green-500 border border-green-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'}`}>
                    {sector.statusBadge}
                  </span>
                </div>

                <div className="space-y-4 pt-4 text-right">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-2">
                    {renderSectorIcon(sector.iconName)}
                  </div>

                  {/* Name and Description */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {sector.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed h-[80px] overflow-hidden text-ellipsis">
                      {sector.description}
                    </p>
                  </div>
                </div>

                {/* Unified CTA Logic */}
                <div className="pt-6" id={`sector-action-container-${sector.id}`}>
                  {sector.isActive && sector.linkUrl ? (
                    <button
                      onClick={() => handleSectorClick(sector)}
                      id={`sector-trigger-${sector.id}`}
                      className="glass-button w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 border-white/10 hover:border-blue-600 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'دخول القطاع التعليمي' : 'Enter Education Sector'}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSectorClick(sector)}
                      id={`sector-trigger-${sector.id}`}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-slate-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-500/20 hover:scale-[1.02] cursor-pointer border border-white/5"
                    >
                      <span>{lang === 'ar' ? 'طلب التفعيل والاطلاع' : 'Request Activation'}</span>
                      <ArrowLeftRight className="w-4 h-4 rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Injection Area for Central Ads (Middle Placement) - بين الأقسام */}
      <Ad_Renderer_Component placement="middle" lang={lang} ads={ads} />

      {/* Meta API & WA Business Sovereign Info section */}
      <section className="px-4 py-16 max-w-7xl mx-auto" id="meta-compliance-info">
        <div className="glass-card p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-white/5 bg-slate-500/5">

          <div className="lg:col-span-8 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider" id="meta-integration-title">
              <ShieldCheck className="w-5 h-5 text-pink-500" />
              <span>إثبات النشاط والامتثال لـ Meta Platforms</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white" id="meta-integration-headline">
              شريك معتمد لـ WhatsApp Business API وحلول المراسلة
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed" id="meta-integration-desc">
              تعتمد منصة <strong className="text-blue-600 dark:text-blue-400">ذكاء سهل</strong> على توجيه تواصل مباشر وبنية معمارية مشفرة من النهاية إلى النهاية لتمكين قطاعات الأعمال والتعليم من مراسلة عملائهم ومستخدميهم بذكاء وأتمتة متناهية، بالامتثال الكامل لسياسات Meta Business Verification وشروط خصوصية Meta للأعمال.
            </p>
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1.5" id="business-verification-info">
              <p className="font-bold text-slate-700 dark:text-slate-300">🏢 معلومات المطابقة التجارية والسيادية:</p>
              <p>• {currentCopy.meta.businessInfo.registeredName}</p>
              <p>• {currentCopy.meta.businessInfo.licenseNumber}</p>
              <p>• {currentCopy.meta.businessInfo.address}</p>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 rounded-2xl bg-slate-500/10 border border-white/5 text-center" id="meta-badge-container">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-blue-500" />
            </div>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block mb-1">
              Meta Approved
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              WhatsApp Business Solution Provider Ready
            </span>
          </div>

        </div>
      </section>

      {/* Injection Area for Central Ads (Bottom Placement) - Pulls from ads_engine via Supabase */}
      <Ad_Renderer_Component placement="bottom" lang={lang} ads={ads} />

      {/* ==========================================
          FOOTER & LEGAL DISCLOSURES (META COMPLIANCE)
         ========================================== */}
      <footer className="glass-nav mt-auto px-4 py-8 md:py-12 border-t border-slate-500/10 text-right" id="legal-footer">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5 text-blue-400" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">ذكاء سهل | Easy Intellect</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                {currentCopy.meta.metaVerificationText}
              </p>
            </div>

            <div className="md:col-span-6 space-y-3 md:text-left flex flex-col md:items-end">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">المستندات القانونية والامتثال</h5>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-start md:justify-end" id="legal-links-list">
                {currentCopy.legal.links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActiveLegalModal({ title: link.title, content: link.content })}
                    className="text-xs text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 font-semibold cursor-pointer underline underline-offset-4"
                  >
                    {link.text}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-slate-500/10 pt-6 space-y-4 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-4xl mx-auto leading-relaxed">
              {currentCopy.legal.metaDisclaimer}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {currentCopy.legal.copyright}
            </p>
          </div>

        </div>
      </footer>

      {/* ==========================================
          INTERACTIVE MODAL FOR INACTIVE SECTORS
          (الصحة، العقارات، التجارة - تفتح نافذة منبثقة)
         ========================================== */}
      {isModalOpen && selectedSector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300"
          id="inactive-sector-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="glass-modal w-full max-w-lg rounded-3xl overflow-hidden p-6 md:p-8 space-y-6 relative border border-white/10"
            id="inactive-sector-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-slate-800/60 hover:bg-slate-700 text-white hover:text-white shadow-lg backdrop-blur-sm transition-all cursor-pointer z-10"
              id="close-modal-x-btn"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title and Sector Header */}
            <div className="text-right space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-[10px] font-bold">
                {currentCopy.modal.title}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  {renderSectorIcon(selectedSector.iconName)}
                </span>
                <span>{selectedSector.name}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {currentCopy.modal.description}
              </p>
            </div>

            {/* Suggestions Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSuggestionSubmit} className="space-y-4 text-right" id="suggestion-form">

                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {currentCopy.modal.motivation}
                </p>

                {/* Textarea for client suggestions */}
                <div className="space-y-1.5">
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder={currentCopy.modal.placeholderSuggestion}
                    rows={4}
                    className="glass-input w-full p-4 rounded-xl text-xs leading-relaxed resize-none"
                    id="suggestion-textarea"
                  ></textarea>
                </div>

                {/* Contact input (email or phone) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    {currentCopy.modal.contactLabel}
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={currentCopy.modal.placeholderContact}
                    className="glass-input w-full p-3.5 rounded-xl text-xs"
                    id="suggestion-contact-input"
                  />
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-button w-full py-3 px-6 rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-2 bg-blue-600 text-white disabled:opacity-50 cursor-pointer hover:bg-blue-700 hover:scale-[1.01]"
                  id="suggestion-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>{currentCopy.modal.submittingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{currentCopy.modal.submitBtn}</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* Success feedback container */
              <div className="text-center py-6 space-y-4" id="suggestion-success-panel">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-black text-slate-900 dark:text-white">
                    {currentCopy.modal.successTitle}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {currentCopy.modal.successDesc}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="glass-button py-2.5 px-6 rounded-xl text-xs font-bold border border-white/10"
                  id="success-close-btn"
                >
                  {currentCopy.modal.closeBtn}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==========================================
          INTERACTIVE MODAL FOR LEGAL LINKS
         ========================================== */}
      {activeLegalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300"
          id="legal-modal-overlay"
          onClick={() => setActiveLegalModal(null)}
        >
          <div
            className="glass-modal w-full max-w-md rounded-3xl overflow-hidden p-6 md:p-8 space-y-5 relative border border-white/10"
            id="legal-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              id="close-legal-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-right space-y-3 pt-2">
              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-blue-500"></span>
                <span>{activeLegalModal.title}</span>
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeLegalModal.content}
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="glass-button w-full py-2.5 rounded-xl text-xs font-bold border border-white/10 cursor-pointer"
              >
                {lang === 'ar' ? 'فهمت وموافق' : 'I Understand'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientAdRequestModal open={adRequestModal} onClose={() => setAdRequestModal(false)} />

      {/* 🛠 DEV TOOL: CACHE DESTROYER - إزالة قبل الإنتاج */}
      <div className="fixed bottom-4 left-4 z-[999] opacity-30 hover:opacity-100 transition-opacity">
        <button
          onClick={async () => {
            await clearCache();
            localStorage.clear();
            window.location.reload();
          }}
          className="text-[10px] bg-red-600/80 text-white px-2.5 py-1 rounded font-mono"
          title="مسح الكاش المحلي و localStorage وإعادة التحميل"
        >
          🧨 تدمير الكاش
        </button>
      </div>

    </div>
  );
}
