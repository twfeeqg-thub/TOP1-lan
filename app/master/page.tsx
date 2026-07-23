'use client'

import {
  Users,
  FolderKanban,
  Megaphone,
  TrendingUp,
  Zap,
  Heart,
} from 'lucide-react'
import { StatsCard } from './components/stats-card'
import { motion } from 'motion/react'

const stats = [
  { title: 'المستخدمون النشطون', value: '12,847', change: '+12%', up: true, icon: Users },
  { title: 'المشاريع الجارية', value: '48', change: '+3', up: true, icon: FolderKanban },
  { title: 'الإعلانات النشطة', value: '124', change: '-2%', up: false, icon: Megaphone },
  { title: 'الإيرادات الشهرية', value: '$284K', change: '+8%', up: true, icon: TrendingUp },
  { title: 'الميزات المطلوبة', value: '36', change: '+6', up: true, icon: Zap },
  { title: 'معدل الرضا', value: '94.2%', change: '+1.2%', up: true, icon: Heart },
]

const recentActivities = [
  { action: 'تم إضافة مستخدم جديد', user: 'أحمد محمد', time: 'منذ 5 دقائق' },
  { action: 'تحديث مشروع "المنصة التعليمية"', user: 'سارة علي', time: 'منذ 12 دقيقة' },
  { action: 'إعلان جديد "تخفيضات رمضان"', user: 'خالد عمر', time: 'منذ 45 دقيقة' },
  { action: 'تفعيل ميزة الدفع الإلكتروني', user: 'نورة أحمد', time: 'منذ ساعتين' },
  { action: 'تقرير أداء المشاريع', user: 'النظام', time: 'منذ 3 ساعات' },
]

const projects = [
  { name: 'المنصة التعليمية', progress: 78, color: 'bg-indigo-500' },
  { name: 'نظام الصحة الإلكتروني', progress: 45, color: 'bg-emerald-500' },
  { name: 'تطبيق العقارات', progress: 92, color: 'bg-amber-500' },
  { name: 'منصة التجارة', progress: 60, color: 'bg-violet-500' },
]

export default function MasterDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <h2 className="text-base font-bold text-white mb-4">آخر النشاطات</h2>
          <div className="space-y-1">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <span className="text-indigo-400 text-xs font-bold">{activity.user[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{activity.action}</p>
                    <p className="text-xs text-white/40">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-white/30">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-base font-bold text-white mb-4">أسرع المشاريع نمواً</h2>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white/80">{project.name}</span>
                  <span className="text-xs text-white/40 font-mono">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${project.color} shadow-[0_0_8px_rgba(99,102,241,0.3)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
