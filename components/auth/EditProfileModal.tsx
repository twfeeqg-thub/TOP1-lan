'use client';

import { useState, useEffect, useCallback } from 'react';
import { GlassModal } from '@/components/ui/glass-modal';
import GlassInput from '@/components/auth/GlassInput';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import GlassButton from '@/components/auth/GlassButton';
import { useAuth } from '@/context/AuthContext';
import { normalizePhone } from '@/lib/phone';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function passwordScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, applyProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState((user?.phone || '').replace(/^\+967/, ''));
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [checkedPhone, setCheckedPhone] = useState<string | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);

  const debouncedPhone = useDebounce(phone, 450);
  const score = passwordScore(password);
  const currentLocal = (user?.phone || '').replace(/^\+967/, '');

  useEffect(() => {
    if (!open) return;
    const target = debouncedPhone;
    if (!target || target === currentLocal || target.length < 6) return;

    let cancelled = false;
    (async () => {
      try {
        const normalized = normalizePhone(`+967${target}`);
        const res = await fetch(
          `/api/auth/check-phone?phone=${encodeURIComponent(normalized)}&exclude=${encodeURIComponent(user?.phone ?? '')}`
        );
        const data = await res.json();
        if (cancelled) return;
        setPhoneAvailable(data.available);
        setCheckedPhone(target);
        setCheckFailed(false);
      } catch {
        if (cancelled) return;
        setPhoneAvailable(null);
        setCheckedPhone(null);
        setCheckFailed(true);
      }
    })();

    return () => { cancelled = true };
  }, [debouncedPhone, open, currentLocal, user?.phone]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSuccess('');
    setLoading(true);

    const payload: Record<string, string> = {};
    if (name && name !== user.name) payload.name = name;
    if (phone) {
      const normalized = normalizePhone(`+967${phone}`);
      if (normalized !== user.phone) payload.phone = normalized;
    }
    if (password) {
      payload.password = password;
      payload.current_password = currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError('لا توجد تغييرات لحفظها');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل تحديث البيانات');
        return;
      }

      applyProfile(data.user, data.access_token);
      setSuccess('تم تحديث بيانات الحساب بنجاح');
      setTimeout(onClose, 1200);
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [user, name, phone, password, currentPassword, applyProfile, onClose]);

  const isCurrentPhone = !debouncedPhone || debouncedPhone === currentLocal || debouncedPhone.length < 6;
  const needsCheck = open && !isCurrentPhone;
  const isChecking = needsCheck && !checkFailed && checkedPhone !== debouncedPhone;

  let phoneStatus: { text: string; color: string } | null = null;
  if (needsCheck && !isChecking) {
    if (checkFailed) {
      phoneStatus = { text: 'تعذر التحقق من الرقم، حاول لاحقاً', color: 'text-red-500' };
    } else {
      phoneStatus = phoneAvailable
        ? { text: '✓ الرقم متاح', color: 'text-green-500' }
        : { text: '✗ هذا الرقم مسجل لحساب آخر', color: 'text-red-500' };
    }
  } else if (isChecking) {
    phoneStatus = { text: 'جارٍ التحقق من توفر الرقم...', color: 'text-[var(--text-muted)]' };
  }

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  return (
    <GlassModal open={open} onClose={onClose} title="تعديل بيانات الحساب">
      <form onSubmit={handleSubmit} className="space-y-5">
        <GlassInput
          label="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك الكامل"
        />

        <div>
          <PhoneInput
            label="رقم الهاتف"
            value={phone}
            onChange={setPhone}
            placeholder="7XX XXX XXX"
          />
          {phoneStatus && (
            <p className={`mt-1 text-xs ${phoneStatus.color}`}>{phoneStatus.text}</p>
          )}
        </div>

        <PasswordInput
          label="كلمة المرور الجديدة (اختياري)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={password && score < 2 ? 'يجب ألا تقل عن 8 أحرف مع أرقام وحروف' : undefined}
        />

        {password && (
          <div className="space-y-1.5 -mt-2">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    score >= i ? strengthColors[score - 1] : 'bg-[var(--sidebar-hover-bg)]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {score <= 1 ? 'ضعيفة' : score === 2 ? 'متوسطة' : score === 3 ? 'قوية' : 'قوية جداً'}
            </p>
          </div>
        )}

        {password && (
          <PasswordInput
            label="كلمة المرور الحالية (للتأكيد)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            error={!currentPassword ? 'مطلوبة قبل تغيير كلمة المرور' : undefined}
          />
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <GlassButton type="submit" loading={loading} className="w-full">
          حفظ التغييرات
        </GlassButton>
      </form>
    </GlassModal>
  );
}
