'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface FeatureItem {
  ar: string;
  en: string;
}

interface ModulesConfig {
  icon: string;
  type: string;
  registerUrl: string;
  loginUrl: string;
  encouragementAr: string;
  encouragementEn: string;
  summaryAr: string;
  summaryEn: string;
  features: FeatureItem[];
  order: number;
}

interface ProjectRow {
  id: string | number;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  modules_config: ModulesConfig;
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

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="glass-card rounded-2xl p-10 animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl" style={{ backgroundColor: 'var(--card-border)' }} />
            <div className="space-y-3 flex-1">
              <div className="h-8 w-48 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
              <div className="h-4 w-72 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
            <div className="h-4 w-5/6 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
            <div className="h-4 w-4/6 rounded-lg" style={{ backgroundColor: 'var(--card-border)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: 'var(--card-border)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesCard({ features }: { features: FeatureItem[] }) {
  if (!features?.length) return null;

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <span className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>
          المميزات
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--glow-color)' }}
          >
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
            <span style={{ color: 'var(--text-main)' }}>{feat.ar}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SectorPage() {
  const params = useParams();
  const slug = params.sector_slug as string;

  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      try {
        const { data, error } = await supabase.client
          .from('project_definitions')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setNotFound(true);
        } else {
          setProject(data as unknown as ProjectRow);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [slug, mounted]);

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-main)' }}
      >
        <div
          className="w-10 h-10 border-[3px] rounded-full animate-spin"
          style={{
            borderColor: 'var(--glass-border)',
            borderTopColor: 'var(--primary)',
          }}
        />
      </div>
    );
  }

  if (loading) {
    return <GlassSkeleton />;
  }

  if (notFound || !project) {
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

  const cfg = project.modules_config;

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
          <span className="text-xl">{cfg.icon}</span>
        </div>
      </nav>

      <div className="h-16" />

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <div className="glass-card rounded-2xl p-8 md:p-10 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl md:text-6xl shrink-0">{cfg.icon}</div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: 'var(--text-main)' }}
              >
                {project.name_ar}
              </h1>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {cfg.summaryAr}
              </p>
            </div>
          </div>

          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{ color: 'var(--text-main)' }}
          >
            {project.description_ar}
          </p>

          <div
            className="p-5 rounded-xl text-sm leading-relaxed"
            style={{
              backgroundColor: 'var(--glow-color)',
              color: 'var(--text-muted)',
            }}
          >
            {cfg.encouragementAr}
          </div>
        </div>

        <FeaturesCard features={cfg.features} />

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            href={cfg.registerUrl}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
          >
            طلب الخدمة
          </Link>
          <Link
            href={cfg.loginUrl}
            className="glass-card inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02]"
            style={{ color: 'var(--text-main)' }}
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    </div>
  );
}
