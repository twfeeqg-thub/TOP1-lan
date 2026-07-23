'use client';

import { ReactNode } from 'react';
import { useApp } from '@/app/providers';
import ThemeSwitcher from './ThemeSwitcher';
import BrandSide from './BrandSide';

interface AuthSplitLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthSplitLayout({ children, title, subtitle }: AuthSplitLayoutProps) {
  const { lang } = useApp();

  return (
    <div className="flex min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="hidden lg:flex lg:w-1/2 relative">
        <BrandSide />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-[var(--bg-main)]">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-main)]">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
              )}
            </div>
            <ThemeSwitcher />
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} ذكاء سهل — المنصة السحابية الموحدة
          </p>
        </div>
      </div>
    </div>
  );
}
