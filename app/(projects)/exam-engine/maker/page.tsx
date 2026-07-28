'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { PenLine, FileQuestion, BookOpen, ListChecks, Plus, Sparkles } from 'lucide-react'
import { Ad_Renderer_Component } from '@/components/ad-renderer'
import IconFrame from '@/components/exam-engine/IconFrame'
import SmartTooltip from '@/components/exam-engine/SmartTooltip'
import { getRandomMessage, encouragementMessages, successMessages } from '@/lib/psych-support'

const questionTypes = [
  { id: 'mcq', label: 'اختيار من متعدد', icon: <ListChecks className="w-8 h-8" /> },
  { id: 'truefalse', label: 'صح / خطأ', icon: <FileQuestion className="w-8 h-8" /> },
  { id: 'essay', label: 'مقالي', icon: <PenLine className="w-8 h-8" /> },
]

const subjects = ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'الدراسات الإسلامية', 'التاريخ', 'الجغرافيا']

export default function MakerPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [savedCount, setSavedCount] = useState(0)

  return (
    <div className="min-h-screen p-4 md:p-8" dir="rtl">
      <Ad_Renderer_Component placement="top" lang="ar" ads={[]} />

      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="glass-card rounded-3xl p-8 glow-card"
        >
          <div className="flex items-center gap-4 mb-6">
            <IconFrame icon={<BookOpen className="w-8 h-8" />} audience="professional" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">لوحة تحكم المعلم</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {getRandomMessage(encouragementMessages)}
              </p>
            </div>
          </div>

          {!showForm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold mb-4">اختر نوع السؤال</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {questionTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedType(type.id)
                        setShowForm(true)
                      }}
                      className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer glow-card"
                    >
                      <SmartTooltip message={type.id === 'mcq' ? 'أنت تبني شيئاً عظيماً، استمر' : undefined}>
                        <IconFrame icon={type.icon} audience="professional" />
                      </SmartTooltip>
                      <span className="font-medium">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">المواد الدراسية</h2>
                <div className="flex flex-wrap gap-3">
                  {subjects.map((subject) => (
                    <span
                      key={subject}
                      className="glass-card rounded-xl px-4 py-2 text-sm cursor-pointer hover:border-[var(--primary)] transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {savedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 border-r-4"
                  style={{ borderRightColor: 'var(--primary)' }}
                >
                  <p className="text-sm font-medium">
                    {getRandomMessage(successMessages)} — تم حفظ {savedCount} سؤال{'٠'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">إضافة سؤال جديد</h2>
                <button
                  onClick={() => { setShowForm(false); setSelectedType(null) }}
                  className="glass-card rounded-xl px-4 py-2 text-sm cursor-pointer hover:border-[var(--primary)] transition-colors"
                >
                  رجوع
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">المادة</label>
                  <select className="glass-input w-full rounded-xl px-4 py-3 text-sm">
                    {subjects.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الصف</label>
                  <select className="glass-input w-full rounded-xl px-4 py-3 text-sm">
                    {['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نص السؤال</label>
                <textarea
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm min-h-[100px]"
                  placeholder="اكتب سؤالك هنا..."
                  dir="rtl"
                />
              </div>

              {selectedType === 'mcq' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium mb-2">الخيارات</label>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(64 + i)}
                      </span>
                      <input
                        className="glass-input flex-1 rounded-xl px-4 py-2 text-sm"
                        placeholder={`الخيار ${i}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">الشرح المبسط</label>
                <textarea
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm min-h-[80px]"
                  placeholder="اكتب شرحاً مبسطاً للإجابة..."
                  dir="rtl"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSavedCount((c) => c + 1)
                  setShowForm(false)
                  setSelectedType(null)
                }}
                className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3 cursor-pointer glow-card mx-auto"
              >
                <Sparkles className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span className="font-semibold">حفظ السؤال</span>
                <Plus className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
