'use client';

import Link from 'next/link';
import { ArrowRight, Layers, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/app/providers';

/**
 * Premium glassmorphic workspace brand bar (Cairo font inherited from the
 * root layout). Back-home + logout are 44×44px touch targets.
 */
export function WorkspaceHeader() {
  const { lang } = useApp();
  const { logout } = useAuth();

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          aria-label={lang === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
          className="touch-target flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--primary)]"
        >
          <ArrowRight className="h-5 w-5 rtl:rotate-180" />
        </Link>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-pink-500 shadow-lg">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-extrabold text-[var(--text-main)]">
              {lang === 'ar' ? 'مساحة تخصيص المشروع' : 'Project Customizer'}
            </h1>
            <p className="truncate text-[10px] text-[var(--text-muted)]">
              {lang === 'ar'
                ? 'تخصيص المظهر والمحتوى والوحدات — يحفظ الفروقات فقط'
                : 'Brand, appearance, content & modules — deltas only'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          aria-label={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          className="touch-target flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}