'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { isValidPhone } from '@/lib/phone';

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, onChange, value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div
          className={`glass-input flex items-center rounded-xl overflow-hidden transition-all duration-200 ${error ? '!border-red-500 !shadow-red-500/20' : ''} ${focused ? '!border-[var(--primary)] !shadow-[var(--glow-color)]' : ''}`}
        >
          <span className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-[var(--text-muted)] border-l border-[var(--card-border)] bg-[var(--glass-bg)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
            +967
          </span>
          <input
            ref={ref}
            type="tel"
            dir="ltr"
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[var(--text-muted)]/50"
            placeholder="7XX XXX XXX"
            value={value}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              const limited = raw.slice(0, 9);
              onChange?.(limited);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
