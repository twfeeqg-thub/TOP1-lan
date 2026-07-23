'use client';

import { Sun, Moon, Palette } from 'lucide-react';
import { useApp, type Theme } from '@/app/providers';

const themes: { key: Theme; icon: typeof Sun; labelAr: string }[] = [
  { key: 'light', icon: Sun, labelAr: 'فاتح' },
  { key: 'dark', icon: Moon, labelAr: 'غامق' },
  { key: 'pink', icon: Palette, labelAr: 'وردي' },
];

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={() => toggleTheme(t.key)}
            className={`theme-btn-transition flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]'
            }`}
            title={t.labelAr}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{t.labelAr}</span>
          </button>
        );
      })}
    </div>
  );
}
