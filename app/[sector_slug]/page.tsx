'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { useProjects, useAds } from '@/hooks/use-projects';
import { Ad_Renderer_Component, AD_FALLBACK } from '@/components/ad-renderer';
import { clearCache } from '@/lib/db';

const SECTOR_KEYWORDS: Record<string, string[]> = {
  education: ['تعليمي', 'edu_'],
  health: ['صحي', 'health_'],
  'real-estate': ['عقاري', 'real_estate_'],
  commerce: ['تجاري', 'commerce_'],
};

interface ModulesConfig {
  name_ar: string;
  name_en?: string;
  description_ar: string;
  description_en?: string;
  icon: string;
  features: { ar: string; en: string }[];
  encouragementAr: string;
  encouragementEn?: string;
  loginUrl: string;
  registerUrl: string;
  summaryAr?: string;
  summaryEn?: string;
  order?: number;
}

interface ProjectRow {
  id: string | number;
  project_slug: string;
  sector_name: string;
  is_active?: boolean;
  modules_config: ModulesConfig;
}

function isProjectInSector(project: Record<string, unknown>, slug: string): boolean {
  const keywords = SECTOR_KEYWORDS[slug];
  if (!keywords) return false;
  for (const kw of keywords) {
    if (String(project.sector_name ?? '').includes(kw)) return true;
    if (String(project.project_slug ?? '').startsWith(kw)) return true;
  }
  return false;
}

function GlassSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="glass-nav px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="h-6 w-24 rounded" style={{ backgroundColor: 'var(--card-border)' }} />
          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: 'var(--card-border)' }} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-8 animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl" style={{ backgroundColor: 'var(--card-border)' }} />
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-40 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
                  <div className="h-4 w-56 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
                <div className="h-3 w-4/5 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
                <div className="h-3 w-3/5 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
              </div>
              <div className="space-y-2 mt-6">
                <div className="h-10 rounded-xl" style={{ backgroundColor: 'var(--card-border)' }} />
                <div className="h-10 rounded-xl" style={{ backgroundColor: 'var(--card-border)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRow }) {
  const cfg = project.modules_config;
  const topFeatures = cfg.features?.slice(0, 3) ?? [];

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-300">
      <div className="flex items-start gap-4 mb-5">
        {cfg.icon && (
          <div className="text-4xl md:text-5xl shrink-0 leading-none">{cfg.icon}</div>
        )}
        <div className="min-w-0">
          <h3
            className="text-xl md:text-2xl font-bold mb-1"
            style={{ color: 'var(--text-main)' }}
          >
            {cfg.name_ar}
          </h3>
          {cfg.summaryAr && (
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {cfg.summaryAr}
            </p>
          )}
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: 'var(--text-muted)' }}
      >
        {cfg.description_ar}
      </p>

      {topFeatures.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
              المميزات
            </span>
          </div>
          <div className="space-y-2">
            {topFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ backgroundColor: 'var(--glow-color)' }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-main)' }}>
                  {feat.ar}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cfg.encouragementAr && (
        <div
          className="p-4 rounded-xl text-xs leading-relaxed mb-5"
          style={{
            backgroundColor: 'var(--glow-color)',
            color: 'var(--text-muted)',
          }}
        >
          {cfg.encouragementAr}
        </div>
      )}

      <div className="mt-auto" />

      <div className="flex flex-wrap gap-3">
        {cfg.registerUrl && (
          <Link
            href={cfg.registerUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
          >
            طلب الخدمة
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
        {cfg.loginUrl && (
          <Link
            href={cfg.loginUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{
              color: 'var(--text-main)',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              backdropFilter: 'blur(var(--glass-blur))',
            }}
          >
            تسجيل الدخول
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SectorPage() {
  const params = useParams();
  const slug = params.sector_slug as string;

  const { data: allProjects = [], isLoading } = useProjects();

  const { data: adsRaw } = useAds();
  const ads = Array.isArray(adsRaw) && adsRaw.length > 0 ? adsRaw : AD_FALLBACK;

  const projects = useMemo(() => {
    return allProjects.filter((p: Record<string, unknown>) =>
      isProjectInSector(p, slug)
    ) as ProjectRow[];
  }, [allProjects, slug]);

  const notFound = !isLoading && projects.length === 0;

  if (isLoading) {
    return <GlassSkeleton />;
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--bg-main)' }}
      >
        <div className="glass-card rounded-2xl p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🔍</div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            غير متوفر
          </h1>
          <p
            className="mb-8 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            لم نعثر على الصفحة التي تبحث عنها.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-main)' }}>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4">
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

      <Ad_Renderer_Component placement="top" lang="ar" ads={ads} />

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id ?? project.project_slug} project={project} />
          ))}
        </div>

        <Ad_Renderer_Component placement="middle" lang="ar" ads={ads} />
      </main>

      <Ad_Renderer_Component placement="bottom" lang="ar" ads={ads} />

      {/* 🛠 DEV TOOL: CACHE DESTROYER */}
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
