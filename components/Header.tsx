'use client'

import { Layers, Sun, Moon, Palette, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '@/app/providers'

interface HeaderProps {
  backHref?: string
  backLabel?: string
}

export default function Header({ backHref, backLabel }: HeaderProps) {
  const { theme, lang, toggleTheme, toggleLang } = useApp()

  const brandTitle = lang === 'ar' ? 'ذكاء سهل' : 'Easy Intellect'
  const brandSubtitle = lang === 'ar' ? 'بوابة التحول الرقمي السيادي المتكامل' : 'The Sovereign Unified Digital Portal'

  return (
    <header className="glass-nav sticky top-0 z-40 px-4 py-3 md:py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5.5 h-5.5 text-white animate-float" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {brandTitle}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {brandSubtitle}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ml-2"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel || (lang === 'ar' ? 'الرئيسية' : 'Home')}
            </Link>
          )}

          <button
            onClick={() => toggleLang(lang === 'ar' ? 'en' : 'ar')}
            className="glass-button text-xs py-2 px-3 md:px-4 rounded-xl flex items-center gap-2 font-semibold hover:bg-slate-500/10 transition-colors"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <div className="flex items-center bg-slate-500/10 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => toggleTheme('light')}
              className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-400 hover:text-slate-100'}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-md scale-105' : 'text-slate-400 hover:text-slate-100'}`}
              title="Dark Theme"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleTheme('pink')}
              className={`p-1.5 rounded-lg theme-btn-transition transition-all ${theme === 'pink' ? 'bg-pink-500 text-white shadow-md scale-105' : 'text-pink-400 hover:text-pink-100'}`}
              title="Pink Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
