import type { FormSchema } from './types'

/**
 * Create-ad-campaign wizard schema for the master panel.
 * Matches the `/api/master/ads` POST contract (ad_config envelope).
 */
export const adFormSchema: FormSchema = {
  id: 'ad',
  title: 'حملة إعلانية',
  description: 'أطلق إعلاناً جديداً داخل محرك الإعلانات السيادي.',
  submitLabel: 'إنشاء الإعلان',
  endpoint: '/api/master/ads',
  invalidateKeys: ['master-ads', 'master-ad-requests', 'master-audit'],
  transform: (values) => {
    const config = {
      title: values.title,
      description: values.description,
      targetUrl: values.targetUrl,
      placement: values.placement,
      display_space: values.display_space,
      lang: values.lang,
      is_exclusive: values.is_exclusive ?? false,
      is_fixed: values.is_fixed ?? false,
      cta_type: values.cta_type || undefined,
    }
    return {
      ad_config: config,
      status: values.status ?? 'active',
    }
  },
  steps: [
    {
      id: 'content',
      title: 'المحتوى',
      description: 'نص الإعلان والوجهة',
      fields: [
        {
          name: 'title',
          label: 'عنوان الإعلان',
          type: 'text',
          placeholder: 'مثال: منصة ذكاء سهل',
          required: true,
          validate: (v) => (typeof v === 'string' && v.trim().length ? null : 'العنوان مطلوب'),
        },
        {
          name: 'description',
          label: 'الوصف',
          type: 'textarea',
          rows: 3,
          placeholder: 'جملة تسويقية مختصرة...',
          required: true,
          validate: (v) => (typeof v === 'string' && v.trim().length ? null : 'الوصف مطلوب'),
        },
        {
          name: 'targetUrl',
          label: 'رابط الهدف',
          type: 'url',
          placeholder: 'https://...',
          dir: 'ltr',
          required: true,
          validate: (v) => (typeof v === 'string' && /^https?:\/\//.test(v) ? null : 'رابط صالح (https://) مطلوب'),
        },
      ],
    },
    {
      id: 'placement',
      title: 'الموضع',
      description: 'أين يظهر الإعلان',
      fields: [
        {
          name: 'placement',
          label: 'الموضع',
          type: 'select',
          options: [
            { label: 'أعلى', value: 'top' },
            { label: 'وسط', value: 'middle' },
            { label: 'أسفل', value: 'bottom' },
          ],
          defaultValue: 'top',
        },
        {
          name: 'display_space',
          label: 'مساحة العرض',
          type: 'select',
          options: [
            { label: 'صفحة الدخول', value: 'Login' },
            { label: 'شاشة كاملة', value: 'Full_Screen' },
            { label: 'بانر', value: 'Banner' },
            { label: 'إعلان أصلي', value: 'Native' },
          ],
          defaultValue: 'Banner',
        },
        {
          name: 'cta_type',
          label: 'نوع الزر (اختياري)',
          type: 'select',
          options: [
            { label: 'زيارة', value: 'visit' },
            { label: 'اتصال', value: 'call' },
            { label: 'واتساب', value: 'whatsapp' },
            { label: 'اشتراك', value: 'subscribe' },
          ],
        },
        {
          name: 'lang',
          label: 'اللغة',
          type: 'select',
          options: [
            { label: 'العربية', value: 'ar' },
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'ar',
        },
      ],
    },
    {
      id: 'status',
      title: 'الحالة',
      description: 'خيارات النشر المتقدمة',
      fields: [
        {
          name: 'status',
          label: 'الحالة',
          type: 'select',
          options: [
            { label: 'نشط', value: 'active' },
            { label: 'متوقف', value: 'inactive' },
          ],
          defaultValue: 'active',
        },
        {
          name: 'is_exclusive',
          label: 'إعلان حصري',
          type: 'boolean',
          defaultValue: false,
        },
        {
          name: 'is_fixed',
          label: 'تثبيت الإعلان',
          type: 'boolean',
          defaultValue: false,
        },
      ],
    },
  ],
}
