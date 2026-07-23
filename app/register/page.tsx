'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/app/providers';
import { useAuth } from '@/context/AuthContext';
import { normalizePhone } from '@/lib/phone';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import GlassInput from '@/components/auth/GlassInput';
import GlassButton from '@/components/auth/GlassButton';
import ServiceHeader from '@/components/auth/ServiceHeader';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function RegisterForm() {
  const { lang } = useApp();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const service = searchParams.get('service');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const debouncedPhone = useDebounce(phone, 500);

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

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!debouncedPhone || debouncedPhone.length < 6) {
        setPhoneAvailable(null);
        return;
      }
      setCheckingPhone(true);
      (async () => {
        try {
          const normalized = normalizePhone(`+967${debouncedPhone}`);
          const res = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(normalized)}`);
          const data = await res.json();
          if (!cancelled) setPhoneAvailable(data.available);
        } catch {
          if (!cancelled) setPhoneAvailable(null);
        } finally {
          if (!cancelled) setCheckingPhone(false);
        }
      })();
    }, 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [debouncedPhone]);

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phoneAvailable) {
      setError('رقم الهاتف غير متاح أو مكرر');
      setLoading(false);
      return;
    }

    try {
      const normalized = normalizePhone(`+967${phone}`);
      const pushToken = null;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalized,
          password,
          name: name || undefined,
          service,
          push_token: pushToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل إنشاء الحساب');
        return;
      }

      login(data.access_token, data.user);

      if (service) {
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

  const getPhoneStatus = () => {
    if (checkingPhone) return { text: lang === 'ar' ? 'جارٍ التحقق...' : 'Checking...', color: 'text-[var(--text-muted)]' };
    if (phoneAvailable === null) return null;
    if (phoneAvailable) return { text: lang === 'ar' ? '✓ رقم الهاتف متاح' : '✓ Phone available', color: 'text-green-500' };
    return { text: lang === 'ar' ? '✗ رقم الهاتف مسجل مسبقاً' : '✗ Phone already registered', color: 'text-red-500' };
  };

  const phoneStatus = getPhoneStatus();

  return (
    <AuthSplitLayout
      title={lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
      subtitle={lang === 'ar' ? 'انضم إلى منصة ذكاء سهل' : 'Join Easy Intellect Platform'}
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
        {phoneStatus && (
          <p className={`-mt-3 text-xs ${phoneStatus.color}`}>{phoneStatus.text}</p>
        )}

        <GlassInput
          label={lang === 'ar' ? 'الاسم (اختياري)' : 'Name (optional)'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
        />

        <PasswordInput
          label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
            {error}
          </div>
        )}

        <GlassButton
          type="submit"
          loading={loading}
          className="w-full"
          disabled={phoneAvailable === false}
        >
          {lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
        </GlassButton>

        <p className="text-center text-sm text-[var(--text-muted)]">
          {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link
            href={`/login?service=${service}`}
            className="text-[var(--primary)] hover:underline font-medium"
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
