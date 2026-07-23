'use client'

import { motion } from 'motion/react'

const projects = [
  { name: 'المنصة التعليمية', status: 'نشط', progress: 78, start: '2026-01-15', team: 12, color: 'bg-[var(--primary)]' },
  { name: 'نظام الصحة الإلكتروني', status: 'قيد التطوير', progress: 45, start: '2026-03-01', team: 8, color: 'bg-emerald-500' },
  { name: 'تطبيق العقارات الذكي', status: 'نشط', progress: 92, start: '2025-11-20', team: 15, color: 'bg-amber-500' },
  { name: 'منصة التجارة الإلكترونية', status: 'مخطط', progress: 10, start: '2026-07-01', team: 6, color: 'bg-violet-500' },
  { name: 'نظام إدارة المستشفيات', status: 'نشط', progress: 60, start: '2026-02-10', team: 10, color: 'bg-rose-500' },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--sidebar-border)]">
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">المشروع</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الحالة</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">التقدم</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">تاريخ البدء</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الفريق</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <motion.tr
                  key={p.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[var(--text-main)]">{p.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--sidebar-hover-bg)] max-w-[120px]">
                        <div
                          className={`h-full rounded-full ${p.color}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{p.start}</td>
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{p.team} أعضاء</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
