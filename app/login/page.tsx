'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/app/providers';
import { useAuth } from '@/context/AuthContext';
import { normalizePhone } from '@/lib/phone';
import { usePsychMessage } from '@/hooks/use-psych-message';
import { loginErrorMessages, welcomeMessages } from '@/lib/psych-support';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import GlassButton from '@/components/auth/GlassButton';
import ServiceHeader from '@/components/auth/ServiceHeader';

function LoginForm() {
  const { lang } = useApp();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const service = searchParams.get('service');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState<string | null>(null);
  const psychError = usePsychMessage(loginErrorMessages);
  const psychWelcome = usePsychMessage(welcomeMessages);

  useEffect(() => {
    if (!service) {
      router.replace('/');
    }
  }, [service, router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalized = normalizePhone(`+967${phone}`);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalized, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول');
        return;
      }

      login(data.access_token, data.user);

      // Non-blocking warm welcome before redirect (auto-hides after 2s).
      setWelcomeMsg(psychWelcome);

      if (data.redirect_to) {
        router.replace(data.redirect_to);
      } else if (service) {
        router.replace(`/${service}`);
      } else {
        router.replace('/');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title={lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
      subtitle={lang === 'ar' ? 'أهلاً بعودتك' : 'Welcome back'}
    >
      <div className="mb-6">
        <ServiceHeader service={service} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PhoneInput
          label={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
          value={phone}
          onChange={setPhone}
          placeholder="7XX XXX XXX"
        />

        <PasswordInput
          label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
            <p className="font-bold">{psychError}</p>
            <p className="mt-1 text-xs opacity-80">{error}</p>
          </div>
        )}

        {welcomeMsg && (
          <div className="glassy-toast flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-emerald-500">
            {welcomeMsg}
          </div>
        )}

        <GlassButton type="submit" loading={loading} className="w-full">
          {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </GlassButton>

        <p className="text-center text-sm text-[var(--text-muted)]">
          {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <Link
            href={`/register?service=${service}`}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            {lang === 'ar' ? 'إنشاء حساب' : 'Register'}
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
