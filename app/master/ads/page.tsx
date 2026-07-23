'use client'

import { motion } from 'motion/react'
import { BarChart3, MousePointerClick, Eye, DollarSign } from 'lucide-react'

const ads = [
  { title: 'تخفيضات رمضان', platform: 'فيسبوك', budget: '$2,500', clicks: '12.4K', impressions: '89K', status: 'نشط', color: 'bg-indigo-500' },
  { title: 'إطلاق المنصة', platform: 'تويتر', budget: '$1,800', clicks: '8.2K', impressions: '45K', status: 'نشط', color: 'bg-emerald-500' },
  { title: 'حملة العودة للمدارس', platform: 'إنستغرام', budget: '$3,200', clicks: '15.7K', impressions: '120K', status: 'متوقف', color: 'bg-amber-500' },
]

export default function AdsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإعلانات', value: '124', icon: BarChart3 },
          { label: 'إجمالي النقرات', value: '36.3K', icon: MousePointerClick },
          { label: 'إجمالي المشاهدات', value: '254K', icon: Eye },
          { label: 'إجمالي الإنفاق', value: '$7,500', icon: DollarSign },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3">
              <item.icon className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight mb-1">{item.value}</p>
            <p className="text-sm text-white/50">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">الإعلان</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">المنصة</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">الميزانية</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">النقرات</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">المشاهدات</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-white/40 tracking-wider">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, i) => (
                <tr key={ad.title} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-white">{ad.title}</td>
                  <td className="px-5 py-4 text-sm text-white/50">{ad.platform}</td>
                  <td className="px-5 py-4 text-sm text-white/50">{ad.budget}</td>
                  <td className="px-5 py-4 text-sm text-white/50">{ad.clicks}</td>
                  <td className="px-5 py-4 text-sm text-white/50">{ad.impressions}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${ad.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {ad.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
