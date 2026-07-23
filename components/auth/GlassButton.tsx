'use client';

import { ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export default function GlassButton({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...props
}: GlassButtonProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[var(--primary)] text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[var(--glow-color)]',
    secondary:
      'glass-card text-[var(--text-main)] hover:border-[var(--primary)] active:scale-[0.98]',
    ghost:
      'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)] active:scale-[0.98]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
