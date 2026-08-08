import type { FormSchema } from './types'

/**
 * Re-exported directly from the sector admin module so the super admin can
 * edit every detailed sector section (7 tabs) exactly like sector admins.
 * The Unified Forms system imports it here (no duplicated form logic) —
 * `DynamicForm` uses the create schema below to spawn the sector, after which
 * this detailed wrapper is surfaced for rich JSONB editing.
 */
export { SectorFormWrapper } from '@/app/master/components/sectors/SectorFormWrapper'

const ICON_OPTIONS = [
  { label: '📁 افتراضي (Folder)', value: 'FolderKanban' },
  { label: '🎓 تعليم (Education)', value: 'GraduationCap' },
  { label: '❤️ صحة (Health)', value: 'HeartPulse' },
  { label: '🏢 عقارات (Real Estate)', value: 'Building2' },
  { label: '🛒 تجارة (Commerce)', value: 'ShoppingCart' },
  { label: '🛍️ متاجر (Shopping)', value: 'ShoppingBag' },
  { label: '⚡ طاقة (Energy)', value: 'Zap' },
  { label: '🛡️ أمن (Security)', value: 'Shield' },
  { label: '📊 إحصاءات (Analytics)', value: 'BarChart3' },
]

/**
 * Create-sector wizard schema. Spawning a new sector requires only identity
 * metadata; its full JSONB content (hero/projects/about/…) is edited later
 * through the 7-tab `SectorFormWrapper` at `/master/sectors/[id]`.
 */
export const sectorFormSchema: FormSchema = {
  id: 'sector',
  title: 'قطاع جديد',
  description: 'أنشئ قطاعاً رقمياً جديداً يُعرض فوراً عبر القالب الزجاجي الديناميكي.',
  submitLabel: 'إنشاء القطاع',
  endpoint: '/api/master/sectors',
  invalidateKeys: ['master-sectors', 'master-audit'],
  steps: [
    {
      id: 'identity',
      title: 'الهوية',
      description: 'البيانات الأساسية للقطاع',
      fields: [
        {
          name: 'name',
          label: 'اسم القطاع',
          type: 'text',
          placeholder: 'مثال: التعليم',
          required: true,
          validate: (v) => (typeof v === 'string' && v.trim().length ? null : 'اسم القطاع مطلوب'),
        },
        {
          name: 'slug',
          label: 'الكود (Slug)',
          type: 'text',
          placeholder: 'education',
          dir: 'ltr',
          required: true,
          hint: 'أحرف صغيرة وواصلات فقط، يبدأ بضرف إنجليزي',
          validate: (v) =>
            typeof v === 'string' && /^[a-z][a-z0-9-]*$/.test(v)
              ? null
              : 'يجب أن يبدأ بحرف لاتيني صغير ويحتوي أحرفاً وأرقاماً وواصلات فقط',
        },
        {
          name: 'icon',
          label: 'الأيقونة',
          type: 'select',
          options: ICON_OPTIONS,
          defaultValue: 'FolderKanban',
        },
        {
          name: 'display_order',
          label: 'ترتيب العرض',
          type: 'number',
          hint: 'قيمة أصغر تعرض أولاً (افتراضياً 0)',
          defaultValue: 0,
        },
      ],
    },
  ],
}