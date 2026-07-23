'use client'

import { motion } from 'motion/react'
import { Zap, Shield, BarChart3, Globe, Lock, Smartphone } from 'lucide-react'

const features = [
  { name: 'دفع إلكتروني', description: 'بوابة دفع متكاملة تدعم多种 العملات', priority: 'عالية', status: 'قيد التطوير', icon: Zap },
  { name: 'نظام صلاحيات', description: 'إدارة صلاحيات المستخدمين والأدوار', priority: 'عالية', status: 'منفذ', icon: Shield },
  { name: 'تقارير متقدمة', description: 'لوحات تحليل وتقارير مخصصة', priority: 'متوسطة', status: 'مخطط', icon: BarChart3 },
  { name: 'دعم متعدد اللغات', description: 'واجهة كاملة بالعربية والإنجليزية', priority: 'متوسطة', status: 'منفذ', icon: Globe },
  { name: 'أمان متقدم', description: 'تشفير البيانات والمصادقة الثنائية', priority: 'عالية', status: 'قيد التطوير', icon: Lock },
  { name: 'تطبيق جوّال', description: 'تطبيق iOS و Android', priority: 'منخفضة', status: 'مخطط', icon: Smartphone },
]

const statusColors: Record<string, string> = {
  'منفذ': 'bg-emerald-500/10 text-emerald-400',
  'قيد التطوير': 'bg-[var(--primary-light)] text-[var(--primary)]',
  'مخطط': 'bg-amber-500/10 text-amber-400',
}

const priorityColors: Record<string, string> = {
  'عالية': 'text-rose-400',
  'متوسطة': 'text-amber-400',
  'منخفضة': 'text-emerald-400',
}

export default function FeaturesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5 group hover:border-[var(--primary)]/20"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-4 group-hover:bg-[var(--sidebar-active-bg)] transition-colors">
                <Icon className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-main)] mb-1">{feature.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-3">{feature.description}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[feature.status] || 'bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)]'}`}>
                  {feature.status}
                </span>
                <span className={`text-xs ${priorityColors[feature.priority] || 'text-[var(--text-muted)]'}`}>
                  {feature.priority}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
