'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceHeader } from '@/components/client/WorkspaceHeader';

/**
 * Client SaaS Workspace layout — strict session guard + premium
 * glassmorphic shell (Cairo font, RTL inherited from the root layout).
 */
export default function ClientWorkspaceLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?service=client');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative min-h-screen">
      {/* Sovereign background glows */}
      <div className="pointer-events-none absolute -top-[10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-[20%] right-[-10%] h-[40%] w-[40%] rounded-full bg-pink-500/10 blur-[120px] animate-pulse-slow" />

      <WorkspaceHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 pb-32">{children}</main>
    </div>
  );
}