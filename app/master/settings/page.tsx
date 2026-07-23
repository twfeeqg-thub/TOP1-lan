'use client'

import { motion } from 'motion/react'
import { Globe, Palette, Shield } from 'lucide-react'
import ThemeSwitcher from '@/components/auth/ThemeSwitcher'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {[
        {
          title: 'الإعدادات العامة',
          icon: Globe,
          fields: [
            { label: 'اسم المنصة', value: 'ذكاء سهل' },
            { label: 'اللغة الافتراضية', value: 'العربية' },
            { label: 'المنطقة الزمنية', value: 'Asia/Aden (UTC+3)' },
          ],
        },
        {
          title: 'الواجهة',
          icon: Palette,
          content: (
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--sidebar-hover-bg)]">
              <div>
                <p className="text-sm text-[var(--text-main)]">الثيم</p>
                <p className="text-xs text-[var(--text-muted)]">اختر نمط الواجهة</p>
              </div>
              <ThemeSwitcher />
            </div>
          ),
        },
        {
          title: 'الأمان',
          icon: Shield,
          fields: [
            { label: 'المصادقة الثنائية', value: 'مفعلة', color: 'text-emerald-400' },
            { label: 'جلسة المستخدم', value: '30 دقيقة' },
            { label: 'عدد المحاولات', value: '5 محاولات' },
          ],
        },
      ].map((section, i) => {
        const Icon = section.icon
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <h2 className="text-base font-bold text-[var(--text-main)]">{section.title}</h2>
            </div>

            {'content' in section && section.content}

            {'fields' in section && section.fields && (
              <div className="space-y-2">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--sidebar-hover-bg)]"
                  >
                    <span className="text-sm text-[var(--text-main)]">{field.label}</span>
                    <span className={`text-sm ${field.color || 'text-[var(--text-muted)]'}`}>
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
