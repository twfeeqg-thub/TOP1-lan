'use client'

import { motion } from 'motion/react'
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react'

const users = [
  { name: 'أحمد محمد', phone: '+967 777 123 456', role: 'سوبر أدمن', status: 'نشط', projects: 12 },
  { name: 'سارة علي', phone: '+967 733 789 012', role: 'محرر', status: 'نشط', projects: 8 },
  { name: 'خالد عمر', phone: '+967 711 345 678', role: 'مسوق', status: 'نشط', projects: 15 },
  { name: 'نورة أحمد', phone: '+967 777 901 234', role: 'مطور', status: 'غير نشط', projects: 3 },
  { name: 'عمر حسن', phone: '+967 733 567 890', role: 'محلل', status: 'نشط', projects: 6 },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المستخدمين', value: '12,847', icon: Users },
          { label: 'النشطون اليوم', value: '1,423', icon: UserCheck },
          { label: 'غير النشطين', value: '234', icon: UserX },
          { label: 'مستخدمون جدد', value: '+156', icon: TrendingUp },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-3">
              <item.icon className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-main)] tracking-tight mb-1">{item.value}</p>
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
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
              <tr className="border-b border-[var(--sidebar-border)]">
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الاسم</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الهاتف</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الدور</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الحالة</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">المشاريع</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.phone}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                        <span className="text-[var(--primary)] text-xs font-bold">{u.name[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text-main)]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{u.phone}</td>
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{u.role}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      u.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)]'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{u.projects}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
