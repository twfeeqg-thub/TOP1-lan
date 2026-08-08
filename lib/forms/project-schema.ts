import type { FormSchema } from './types'

/**
 * Create-PWA-project wizard schema. `sector_name` is a select whose live
 * options are injected at runtime by the forms page (from `/api/master/sectors`),
 * keeping the schema declarative while the data stays dynamic.
 */
export const projectFormSchema: FormSchema = {
  id: 'project',
  title: 'مشروع PWA',
  description: 'سجّل مشروعاً تطبيقياً جديداً يُدار بالكامل من لوحة الماستر.',
  submitLabel: 'إنشاء المشروع',
  endpoint: '/api/master/projects',
  invalidateKeys: ['master-projects', 'master-audit'],
  steps: [
    {
      id: 'identity',
      title: 'الهوية',
      description: 'اسم المشروع وربطه بالقطاع',
      fields: [
        {
          name: 'name',
          label: 'اسم المشروع',
          type: 'text',
          placeholder: 'مثال: المنصة التعليمية',
          required: true,
          validate: (v) => (typeof v === 'string' && v.trim().length ? null : 'اسم المشروع مطلوب'),
        },
        {
          name: 'slug',
          label: 'الكود (Slug)',
          type: 'text',
          placeholder: 'edu-platform',
          dir: 'ltr',
          required: true,
          validate: (v) =>
            typeof v === 'string' && /^[a-z][a-z0-9-]*$/.test(v)
              ? null
              : 'يجب أن يبدأ بحرف لاتيني صغير ويحتوي أحرفاً وأرقاماً وواصلات فقط',
        },
        {
          name: 'sector_name',
          label: 'القطاع',
          type: 'select',
          placeholder: 'اختر القطاع',
          required: true,
          options: [],
          validate: (v) => (typeof v === 'string' && v.trim().length ? null : 'اختر القطاع'),
        },
      ],
    },
    {
      id: 'config',
      title: 'التهيئة',
      description: 'تهيئة JSONB متقدمة (اختياري)',
      fields: [
        {
          name: 'modules_config',
          label: 'تهيئة المشروع (JSON)',
          type: 'json',
          placeholder: '{"version":"2.0","features":["analytics"]}',
          dir: 'ltr',
          hint: 'تُحفظ كما هي داخل core.project_definitions.modules_config',
        },
      ],
    },
  ],
}
