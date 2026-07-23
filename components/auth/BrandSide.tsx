'use client';

import { useApp, type Lang } from '@/app/providers';

const CONTENT: Record<Lang, { badge: string; tagline: string }> = {
  ar: {
    badge: 'منصة سحابية سيادية',
    tagline: 'بوابتك الآمنة للتحول الرقمي',
  },
  en: {
    badge: 'Sovereign Cloud Platform',
    tagline: 'Your secure gateway to digital transformation',
  },
};

export default function BrandSide() {
  const { lang } = useApp();
  const text = CONTENT[lang];

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/10" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl animate-float" />

      <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)]/10 mx-auto">
            <svg className="h-10 w-10 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">ذكاء سهل</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{text.tagline}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] backdrop-blur-sm">
          <svg className="h-3.5 w-3.5 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {text.badge}
        </span>
      </div>
    </div>
  );
}
