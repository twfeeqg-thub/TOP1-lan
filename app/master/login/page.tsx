'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/app/providers';
import { useAuth } from '@/context/AuthContext';
import { normalizePhone } from '@/lib/phone';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import GlassButton from '@/components/auth/GlassButton';
import GlassInput from '@/components/auth/GlassInput';

export default function MasterLoginPage() {
  const { lang } = useApp();
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin') {
      router.replace('/master');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalized = phone.startsWith('+') ? phone : normalizePhone(`+967${phone}`);

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

      if (data.user.role === 'super_admin' || data.user.role === 'master') {
        router.replace('/master');
      } else {
        setError('ليس لديك صلاحية الوصول إلى لوحة الماستر');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title={lang === 'ar' ? 'لوحة الماستر' : 'Master Panel'}
      subtitle={lang === 'ar' ? 'دخول المسؤولين فقط' : 'Admin access only'}
    >
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
            {error}
          </div>
        )}

        <GlassButton type="submit" loading={loading} className="w-full">
          {lang === 'ar' ? 'دخول الماستر' : 'Master Login'}
        </GlassButton>
      </form>
    </AuthSplitLayout>
  );
}
