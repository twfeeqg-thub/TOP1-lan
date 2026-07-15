"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  supabase, 
  isSupabaseConfigured, 
  fallbackProjects, 
  type ProjectDefinition 
} from "../lib/supabase";
import { useApp, type Theme, type Lang } from "./providers";
import { cn } from "../lib/utils";
import { 
  GraduationCap, 
  FileText, 
  Layers, 
  HeartPulse, 
  Building2, 
  ShoppingBag,
  Sun,
  Moon,
  Sparkles,
  Languages,
  Clock,
  Shield,
  ArrowRight,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  X,
  Smartphone,
  Cpu
} from "lucide-react";

// Lucide icon mapping to render dynamic icons safely
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap: GraduationCap,
  FileText: FileText,
  Orbit: Layers,
  HeartPulse: HeartPulse,
  Building2: Building2,
  ShoppingBag: ShoppingBag,
};

function ProjectIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || Sparkles;
  return <IconComponent className={className} />;
}

// Full translation dictionary to ensure absolute content decoupling
const translations = {
  ar: {
    brand: "ذكاء سهل",
    tagline: "بوابة التحول الرقمي السيادي",
    heroBadge: "بوابة موحدة ومؤمنة بالكامل للأنظمة الوطنية",
    heroTitlePrefix: "التحول الرقمي ",
    heroTitleHighlight: "السيادي والآمن",
    heroTitleSuffix: " للمستقبل",
    heroSubtitle: "منصة سحابية متقدمة متعددة المستأجرين مبنية لإدارة وتشغيل الأنظمة التعليمية والصحية والعقارية والتجارية بسيادة تامة.",
    ctaExplore: "استكشف الخدمات والحلول",
    ctaWatchVideo: "فيديو تعريفي",
    statusConnected: "قاعدة البيانات متصلة بشكل نشط وآمن",
    statusDemo: "الوضع التجريبي: نعرض بيانات هيكلية مشفرة لعدم تهيئة المفاتيح",
    
    sectionTitle: "حلولنا المتكاملة للقطاعات الوطنية",
    sectionSubtitle: "استكشف بوابات الخدمات الرقمية المؤمنة والمصممة خصيصاً لتلبية التطلعات والمقاييس السيادية.",
    
    all: "جميع القطاعات",
    edu: "القطاع التعليمي",
    health: "القطاع الصحي",
    realestate: "القطاع العقاري",
    commerce: "القطاع التجاري",
    
    comingSoon: "قريباً",
    activeStatus: "نشط ومتاح حالياً",
    launchService: "ابدأ الخدمة",
    showDetails: "عرض التفاصيل والمميزات",
    operationalStatus: "الحالة التشغيلية للمستأجر",
    coreSystem: "نظام سيادي مخصص",
    keyFeatures: "أبرز مميزات الخدمة والأنظمة الفرعية",
    
    valuesTitle: "ركائز وقيم وطنية نعتز بها",
    valuesSubtitle: "نعمل بأعلى مستويات المعايير الهندسية لضمان الريادة والاستدامة.",
    
    val1Title: "السيادة الكاملة على البيانات",
    val1Desc: "حفظ وتشفير بيانات المواطنين والمنشآت داخل بنية تحتية محلية مستقلة تماماً وممتثلة للأنظمة الوطنية.",
    val2Title: "قابلية توسع متعددة المستأجرين",
    val2Desc: "معمارية فريدة تخدم آلاف المستأجرين بمرونة بالغة مع عزل كامل ومستقل للبيانات والواجهات المخصصة.",
    val3Title: "كفاءة واستمرارية تشغيلية",
    val3Desc: "سرعة استجابة فائقة، دعم للعمل دون اتصال، وأنظمة احتياطية ذكية تضمن استمرارية الأعمال 24/7.",
    
    detailsTitle: "تفاصيل النظام والمميزات الفرعية للخدمة",
    systemSlug: "معرف النظام الفرعي (Slug)",
    sectorName: "اسم القطاع المسجل",
    close: "إغلاق",
    launchPortal: "الدخول لبوابة الخدمة الآمنة (SSO)",
    loadingData: "جاري جلب تهيئة الأنظمة الفيدرالية...",
    retryButton: "إعادة المحاولة",
    noDataFound: "لم يتم العثور على أنظمة فرعية مفعّلة حالياً.",
    activeUsersLabel: "المستأجرين النشطين",
    securityAuditLabel: "مستوى الأمان والتحقق",
    certifiedSovereign: "ممتثل وموثق سيادياً",
    
    footerCopyright: "جميع الحقوق محفوظة © ٢٠٢٦ منصة ذكاء سهل",
    footerCompliance: "ممتثل لضوابط الأمن السيبراني الوطنية ومعايير التحول الرقمي السيادي المتكامل.",
    compliancePrivacy: "سياسة الخصوصية السيادية",
    complianceTerms: "شروط الاستخدام والاتفاقيات",
    complianceSLA: "اتفاقية مستوى الخدمة الرقمية",
  },
  en: {
    brand: "Thakaa Sahl",
    tagline: "Sovereign Digital Transformation Portal",
    heroBadge: "Unified & Fully Secured Sovereign National Gateway",
    heroTitlePrefix: "Sovereign & Secure ",
    heroTitleHighlight: "Digital Transformation",
    heroTitleSuffix: " for the Future",
    heroSubtitle: "An advanced multi-tenant cloud platform engineered to operate educational, health, real estate, and commercial systems under full national sovereignty.",
    ctaExplore: "Explore Secure Solutions",
    ctaWatchVideo: "Introductory Video",
    statusConnected: "Connected to Secure Central Database",
    statusDemo: "Demo Mode: Displaying encrypted structural data (Env Keys Pending)",
    
    sectionTitle: "Integrated Solutions for National Sectors",
    sectionSubtitle: "Explore secure digital service portals designed specifically to meet strategic sovereign goals and parameters.",
    
    all: "All Sectors",
    edu: "Education Sector",
    health: "Healthcare Sector",
    realestate: "Real Estate",
    commerce: "Commerce & Business",
    
    comingSoon: "Coming Soon",
    activeStatus: "Active & Available",
    launchService: "Launch Service",
    showDetails: "View Details & Features",
    operationalStatus: "Tenant Operational Status",
    coreSystem: "Sovereign Custom System",
    keyFeatures: "Key Service Features & Subsystems",
    
    valuesTitle: "Sovereign Pillars We Stand For",
    valuesSubtitle: "Engineering the future of national services with unprecedented security, speed, and integrity.",
    
    val1Title: "Full Data Sovereignty",
    val1Desc: "Citizen and institutional data fully stored, encrypted, and governed in highly secured localized cloud environments.",
    val2Title: "Multi-Tenant Scalability",
    val2Desc: "A robust scalable architecture serving thousands of individual tenants with complete database and view isolation.",
    val3Title: "Efficiency & Resilient Continuity",
    val3Desc: "Blazing fast speeds, offline service worker capability, and automatic backups guaranteeing 24/7 business continuity.",
    
    detailsTitle: "System Configurations & Sub-features",
    systemSlug: "Subsystem Identifier (Slug)",
    sectorName: "Registered Sector Name",
    close: "Close Window",
    launchPortal: "Access Secure Service Portal (SSO)",
    loadingData: "Fetching federal systems configurations...",
    retryButton: "Retry Fetch",
    noDataFound: "No active subsystems found in current node.",
    activeUsersLabel: "Active Tenants",
    securityAuditLabel: "Security & Audit Level",
    certifiedSovereign: "Sovereign Certified",
    
    footerCopyright: "All Rights Reserved © 2026 Thakaa Sahl Platform",
    footerCompliance: "Fully compliant with national cybersecurity rules, federal standards, and sovereign cloud frameworks.",
    compliancePrivacy: "Sovereign Privacy Policy",
    complianceTerms: "Terms of Safe Use",
    complianceSLA: "Service Level Agreement (SLA)",
  }
};

function LandingPageContent() {
  const { theme, lang, toggleTheme, toggleLang } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<"all" | "edu" | "health" | "realestate" | "commerce">("all");
  const [selectedProject, setSelectedProject] = useState<ProjectDefinition | null>(null);
  const [isPending, startTransition] = useTransition();

  // Selected service from URL query param to allow direct link sharing
  const activeServiceSlug = searchParams.get("service");

  // React Query to fetch data from Supabase (targeting 'core' schema)
  const { data: projects = [], isLoading, error, refetch } = useQuery<ProjectDefinition[]>({
    queryKey: ["project_definitions"],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        // Mock network delay for premium visual load feel
        await new Promise((resolve) => setTimeout(resolve, 600));
        return fallbackProjects;
      }
      
      const { data, error: fetchError } = await supabase
        .from("project_definitions")
        .select("*")
        .order("id", { ascending: true });

      if (fetchError) {
        console.error("Supabase query error:", fetchError);
        throw fetchError;
      }
      return data as ProjectDefinition[];
    },
  });

  const dict = translations[lang];

  // Map category filter on memory
  const filteredProjects = projects.filter((proj) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "edu") return proj.project_slug.startsWith("edu_");
    if (activeCategory === "health") return proj.project_slug.startsWith("health_");
    if (activeCategory === "realestate") return proj.project_slug.startsWith("real_estate") || proj.project_slug.includes("realestate");
    if (activeCategory === "commerce") return proj.project_slug.startsWith("commerce_") || proj.project_slug.includes("commerce");
    return true;
  });

  // Handle opening details
  const handleOpenDetails = (proj: ProjectDefinition) => {
    setSelectedProject(proj);
    // Push slug to URL query parameter safely using transitions
    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("service", proj.project_slug);
      router.push(url.pathname + url.search, { scroll: false });
    });
  };

  // Close details and remove query param
  const handleCloseDetails = () => {
    setSelectedProject(null);
    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("service");
      router.push(url.pathname, { scroll: false });
    });
  };

  // Check if there is an active direct link via search parameters
  React.useEffect(() => {
    if (activeServiceSlug && projects.length > 0) {
      const matched = projects.find((p) => p.project_slug === activeServiceSlug);
      if (matched) {
        const timer = setTimeout(() => {
          setSelectedProject(matched);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [activeServiceSlug, projects]);

  return (
    <div className="min-h-screen relative flex flex-col transition-colors duration-300">
      
      {/* Decorative Blur Backgrounds representing Glassmorphism Glow */}
      <div className="absolute top-0 left-1/4 w-[45vw] h-[45vw] rounded-full pointer-events-none opacity-40 blur-[120px] bg-radial" 
           style={{ backgroundImage: 'var(--hero-glow)' }} />
      <div className="absolute bottom-20 right-1/4 w-[35vw] h-[35vw] rounded-full pointer-events-none opacity-30 blur-[120px] bg-radial" 
           style={{ backgroundImage: 'var(--hero-glow)' }} />

      {/* HEADER SECTION WITH NAVIGATION AND THEME SWITCHER */}
      <header id="platform-header" className="sticky top-0 z-40 w-full glass-panel border-b border-opacity-50 transition-all duration-300 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white pulse-glow" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                {dict.brand}
              </span>
              <p className="text-[10px] font-medium opacity-60 max-sm:hidden">
                {dict.tagline}
              </p>
            </div>
          </div>

          {/* Right Controls (Theme & Lang Switchers) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Database status pill */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-panel border-opacity-40 max-sm:hidden",
              isSupabaseConfigured ? "text-emerald-500" : "text-amber-500"
            )}>
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? "Sovereign DB" : "Demo Node"}</span>
            </div>

            {/* Language Switcher Button */}
            <button
              id="lang-toggle-btn"
              onClick={() => toggleLang()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold glass-panel glass-panel-interactive border-opacity-50 hover:bg-white hover:bg-opacity-5"
              aria-label="Toggle Language"
            >
              <Languages className="w-4 h-4 text-blue-500" />
              <span className="text-xs uppercase">{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Premium Theme Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl glass-panel border-opacity-40 gap-1">
              {(["light", "dark", "pink"] as Theme[]).map((t) => (
                <button
                  key={t}
                  id={`theme-btn-${t}`}
                  onClick={() => toggleTheme(t)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                    theme === t 
                      ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/10" 
                      : "opacity-60 hover:opacity-100 hover:bg-white hover:bg-opacity-5"
                  )}
                  title={`Switch to ${t} theme`}
                >
                  {t === "light" && <Sun className="w-4 h-4" />}
                  {t === "dark" && <Moon className="w-4 h-4" />}
                  {t === "pink" && <Sparkles className="w-4 h-4 text-pink-400" />}
                </button>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">

        {/* HERO SECTION */}
        <section id="hero-section" className="text-center py-12 md:py-20 flex flex-col items-center">
          
          {/* Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-500 shadow-sm mb-6 animate-fade-in">
            <Shield className="w-3.5 h-3.5 text-blue-500 pulse-glow" />
            <span>{dict.heroBadge}</span>
          </div>

          {/* Majestic Hero Header */}
          <h1 className="text-3.5xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl text-center">
            {lang === "ar" ? (
              <>
                <span>{dict.heroTitlePrefix}</span>
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent px-1">
                  {dict.heroTitleHighlight}
                </span>
                <span>{dict.heroTitleSuffix}</span>
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent px-1">
                  {dict.heroTitleHighlight}
                </span>
                <span>{dict.heroTitleSuffix}</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl opacity-70 max-w-2xl leading-relaxed">
            {dict.heroSubtitle}
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
            <a 
              href="#sectors-section" 
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{dict.ctaExplore}</span>
              {lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </a>
            
            <div className="px-6 py-4 rounded-xl text-sm font-semibold glass-panel border-opacity-40 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="opacity-80">UTC 2026-07-15</span>
            </div>
          </div>

          {/* Real-time DB Status banner */}
          <div className="mt-8 text-xs font-semibold px-4 py-2 rounded-lg glass-panel border-opacity-20 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full pulse-glow", isSupabaseConfigured ? "bg-emerald-500" : "bg-amber-500")} />
            <span className="opacity-85">
              {isSupabaseConfigured ? dict.statusConnected : dict.statusDemo}
            </span>
          </div>

        </section>

        {/* INTEGRATED SOLUTIONS / SECTORS SECTION */}
        <section id="sectors-section" className="py-16 border-t border-white border-opacity-5">
          
          <div className="text-center mb-12">
            <h2 className="text-2.5xl sm:text-4xl font-extrabold tracking-tight">
              {dict.sectionTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
              {dict.sectionSubtitle}
            </p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
            {([
              { id: "all", label: dict.all },
              { id: "edu", label: dict.edu },
              { id: "health", label: dict.health },
              { id: "realestate", label: dict.realestate },
              { id: "commerce", label: dict.commerce }
            ] as const).map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 glass-panel border-opacity-40 flex items-center gap-2",
                  activeCategory === cat.id 
                    ? "bg-gradient-to-tr from-blue-500 via-indigo-600 to-indigo-700 text-white border-opacity-10 border-transparent shadow-lg shadow-blue-500/10" 
                    : "opacity-75 hover:opacity-100 hover:bg-white hover:bg-opacity-5"
                )}
              >
                {cat.id === "all" && <Layers className="w-4 h-4" />}
                {cat.id === "edu" && <GraduationCap className="w-4 h-4 text-blue-400" />}
                {cat.id === "health" && <HeartPulse className="w-4 h-4 text-emerald-400" />}
                {cat.id === "realestate" && <Building2 className="w-4 h-4 text-amber-400" />}
                {cat.id === "commerce" && <ShoppingBag className="w-4 h-4 text-rose-400" />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* DYNAMIC CARD GRID */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-sm opacity-70 font-medium">{dict.loadingData}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 glass-panel border-red-500/20 max-w-xl mx-auto rounded-2xl p-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-base font-bold mb-4">Error Connecting to Sovereign Node</p>
              <button 
                onClick={() => refetch()} 
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                {dict.retryButton}
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="opacity-70 text-sm font-medium">{dict.noDataFound}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => {
                const config = proj.modules_config;
                const title = lang === "ar" ? config.title_ar : config.title_en;
                const desc = lang === "ar" ? config.description_ar : config.description_en;
                const features = lang === "ar" ? config.features_ar : config.features_en;

                return (
                  <div
                    key={proj.id}
                    id={`project-card-${proj.project_slug}`}
                    className={cn(
                      "rounded-2xl p-6 glass-panel flex flex-col justify-between overflow-hidden relative group",
                      proj.is_active 
                        ? "glass-panel-interactive border-opacity-60 cursor-pointer" 
                        : "opacity-60 grayscale-[15%]"
                    )}
                    onClick={() => proj.is_active && handleOpenDetails(proj)}
                  >
                    
                    {/* Glowing highlight corner */}
                    <div className={cn(
                      "absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none bg-gradient-to-br",
                      config.accent_color || "from-blue-500 to-indigo-500"
                    )} />

                    <div>
                      {/* Badge status header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase bg-white bg-opacity-5 px-2.5 py-1 rounded-full border border-white border-opacity-5">
                          {proj.sector_name}
                        </span>
                        
                        {proj.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 px-2.5 py-1 rounded-full shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-glow" />
                            <span>{dict.activeStatus}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 border border-amber-500/25 text-amber-500 px-2.5 py-1 rounded-full">
                            <Lock className="w-3 h-3" />
                            <span>{dict.comingSoon}</span>
                          </span>
                        )}
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-4 mt-2">
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-tr p-0.5 flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/10",
                          config.accent_color || "from-blue-500 to-indigo-500"
                        )}>
                          <div className="w-full h-full rounded-[10px] bg-slate-900 bg-opacity-90 flex items-center justify-center">
                            <ProjectIcon name={config.icon || ""} className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-blue-500 transition-colors">
                            {title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-xs opacity-75 leading-relaxed min-h-[48px]">
                        {desc}
                      </p>

                      {/* Compact feature list */}
                      {features && features.length > 0 && (
                        <ul className="mt-4 space-y-2 border-t border-white border-opacity-5 pt-4">
                          {features.slice(0, 2).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[11px] opacity-80">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Bottom Action Section */}
                    <div className="mt-6 pt-4 border-t border-white border-opacity-5 flex items-center justify-between">
                      <span className="text-[10px] opacity-50 font-mono uppercase">
                        {proj.project_slug}
                      </span>
                      
                      {proj.is_active ? (
                        <button
                          id={`btn-action-${proj.project_slug}`}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>{dict.showDetails}</span>
                          {lang === "ar" ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold opacity-40 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>{dict.comingSoon}</span>
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* CORE VALUES / CHERISHED PILLARS */}
        <section id="values-section" className="py-16 border-t border-white border-opacity-5">
          <div className="text-center mb-12">
            <h2 className="text-2.5xl sm:text-4xl font-extrabold tracking-tight">
              {dict.valuesTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
              {dict.valuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">{dict.val1Title}</h3>
              <p className="text-xs opacity-75 leading-relaxed">{dict.val1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">{dict.val2Title}</h3>
              <p className="text-xs opacity-75 leading-relaxed">{dict.val2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">{dict.val3Title}</h3>
              <p className="text-xs opacity-75 leading-relaxed">{dict.val3Desc}</p>
            </div>

          </div>
        </section>

      </main>

      {/* DYNAMIC DETAILS / SYSTEM CONFIG DRAWER OVERLAY */}
      {selectedProject && (
        <div 
          id="details-overlay-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={handleCloseDetails}
        >
          <div 
            id="details-panel"
            className="w-full max-w-2xl glass-panel rounded-2xl overflow-hidden relative max-h-[90vh] flex flex-col shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white border-opacity-5 flex items-center justify-between bg-white bg-opacity-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl p-0.5 flex items-center justify-center text-white",
                  selectedProject.modules_config.accent_color || "from-blue-500 to-indigo-500"
                )}>
                  <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center">
                    <ProjectIcon name={selectedProject.modules_config.icon || ""} className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {lang === "ar" ? selectedProject.modules_config.title_ar : selectedProject.modules_config.title_en}
                  </h3>
                  <span className="text-[10px] opacity-60 uppercase tracking-wide">
                    {selectedProject.sector_name}
                  </span>
                </div>
              </div>
              
              <button 
                id="close-details-btn"
                onClick={handleCloseDetails}
                className="w-8 h-8 rounded-full flex items-center justify-center glass-panel hover:bg-white hover:bg-opacity-10 transition"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              
              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase opacity-50 tracking-wider">
                  {lang === "ar" ? "نظرة عامة على النظام" : "System Overview"}
                </h4>
                <p className="opacity-85 leading-relaxed text-xs">
                  {lang === "ar" ? selectedProject.modules_config.description_ar : selectedProject.modules_config.description_en}
                </p>
              </div>

              {/* Sub-system Technical specifications */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="p-3.5 rounded-xl glass-panel border-opacity-30 bg-white bg-opacity-1">
                  <span className="text-[10px] opacity-50 block mb-1">
                    {dict.systemSlug}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase text-indigo-400">
                    {selectedProject.project_slug}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl glass-panel border-opacity-30 bg-white bg-opacity-1">
                  <span className="text-[10px] opacity-50 block mb-1">
                    {dict.operationalStatus}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                    <span>{dict.activeStatus}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl glass-panel border-opacity-30 bg-white bg-opacity-1">
                  <span className="text-[10px] opacity-50 block mb-1">
                    {dict.activeUsersLabel}
                  </span>
                  <span className="text-xs font-extrabold opacity-90">
                    120+ {lang === "ar" ? "جهة حكومية" : "Federal Tenants"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl glass-panel border-opacity-30 bg-white bg-opacity-1">
                  <span className="text-[10px] opacity-50 block mb-1">
                    {dict.securityAuditLabel}
                  </span>
                  <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{dict.certifiedSovereign}</span>
                  </span>
                </div>

              </div>

              {/* Features full list */}
              {selectedProject.modules_config.features_ar && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase opacity-50 tracking-wider">
                    {dict.keyFeatures}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lang === "ar" 
                      ? selectedProject.modules_config.features_ar 
                      : selectedProject.modules_config.features_en || []
                    ).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white bg-opacity-2 border border-white border-opacity-5 text-xs">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 text-emerald-500" />
                        </div>
                        <span className="opacity-90">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Secure single-sign-on mock gateway */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 pulse-glow" />
                <div className="space-y-1">
                  <span className="font-bold text-xs block text-blue-400">
                    {lang === "ar" ? "بوابة النفاذ الوطني الموحد (SSO)" : "National Single Sign-On (SSO)"}
                  </span>
                  <p className="text-[11px] opacity-75">
                    {lang === "ar" 
                      ? "سيتم تحويلك بشكل آمن لتسجيل الدخول الفيدرالي والتحقق من الهوية الرقمية السيادية التابعة لجهة العمل المعتمدة." 
                      : "You will be redirected securely to the national federal authentication gateway for corporate ID validation."}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white border-opacity-5 bg-white bg-opacity-2 flex items-center justify-end gap-3">
              <button 
                id="cancel-modal-btn"
                onClick={handleCloseDetails}
                className="px-5 py-2.5 rounded-lg text-xs font-bold opacity-70 hover:opacity-100 hover:bg-white hover:bg-opacity-5 transition"
              >
                {dict.close}
              </button>
              <button 
                id="launch-sso-btn"
                onClick={() => {
                  alert(lang === "ar" ? "جاري توجيهك بأمان لنظام النفاذ الموحد..." : "Redirecting securely to National SSO Gateway...");
                }}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{dict.launchPortal}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer id="platform-footer" className="mt-auto border-t border-white border-opacity-5 glass-panel py-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white border-opacity-5">
            
            {/* Footer Logo info */}
            <div className="flex items-center gap-3 max-md:text-center max-md:flex-col">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-500 p-0.5 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm">{dict.brand}</span>
                <p className="text-[10px] opacity-60 mt-0.5">{dict.tagline}</p>
              </div>
            </div>

            {/* Links and Policies */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold opacity-75">
              <a href="#" className="hover:text-blue-500 transition">{dict.compliancePrivacy}</a>
              <span className="opacity-20">•</span>
              <a href="#" className="hover:text-blue-500 transition">{dict.complianceTerms}</a>
              <span className="opacity-20">•</span>
              <a href="#" className="hover:text-blue-500 transition">{dict.complianceSLA}</a>
            </div>

          </div>

          {/* Compliance and system indicators */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-55">
            <span className="text-center sm:text-right">{dict.footerCopyright}</span>
            <span className="text-center sm:text-left flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>{dict.footerCompliance}</span>
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-[#f9fafb] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-sm font-bold tracking-wide">جاري الاتصال بنظام النفاذ السيادي...</span>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
