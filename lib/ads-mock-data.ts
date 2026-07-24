import type { AdRequest, Ad, KillSwitchState } from './ad-types'

export const adRequestsMock: AdRequest[] = [
  {
    id: 'req-1',
    client_info: {
      business_name: 'مخبز الأصيل',
      whatsapp: '967777111222',
      target_sector: 'التجارة',
    },
    campaign: {
      start_date: '2026-08-01',
      end_date: '2026-08-30',
      package: 'standard',
    },
    attachments: {},
    design_request: {
      marketing_text: 'أجود أنواع المعجنات الطازجة يومياً',
      preferred_colors: '#8B4513,#FFD700',
      cta_type: 'whatsapp',
    },
    status: 'pending',
    created_at: '2026-07-20T10:30:00Z',
  },
  {
    id: 'req-2',
    client_info: {
      business_name: 'عيادة النور التخصصية',
      whatsapp: '967733444555',
      target_sector: 'الصحة',
    },
    campaign: {
      start_date: '2026-08-05',
      end_date: '2026-09-05',
      package: 'exclusive',
    },
    attachments: {
      card_url: '/mock/card-1.png',
      payment_proof_url: '/mock/payment-1.png',
    },
    status: 'pending',
    created_at: '2026-07-21T14:00:00Z',
  },
  {
    id: 'req-3',
    client_info: {
      business_name: 'مكتبة المعرفة',
      whatsapp: '967700111333',
      target_sector: 'التعليم',
    },
    campaign: {
      start_date: '2026-08-10',
      end_date: '2026-08-25',
      package: 'video',
    },
    attachments: {},
    status: 'approved',
    created_at: '2026-07-18T09:00:00Z',
    updated_at: '2026-07-19T11:00:00Z',
  },
]

export const adsMock: Ad[] = [
  {
    id: 'ad-1',
    ad_config: {
      title: 'منصة ذكاء سهل للتحول الرقمي',
      description: 'حلول سحابية سيادية متكاملة مع WhatsApp Business API',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'top',
      display_space: 'Banner',
      lang: 'ar',
      is_exclusive: false,
      is_fixed: false,
      cta_type: 'visit',
    },
    status: 'active',
    clicks: 12400,
    impressions: 89000,
    budget: '$2,500',
    platform: 'فيسبوك',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'ad-2',
    ad_config: {
      title: 'إطلاق المنصة التعليمية',
      description: 'منصة تعليمية متكاملة للتعلم عن بعد',
      targetUrl: 'https://edu.ai-sahl.com',
      placement: 'middle',
      display_space: 'Full_Screen',
      lang: 'ar',
      is_exclusive: true,
      is_fixed: true,
      cta_type: 'subscribe',
    },
    status: 'active',
    clicks: 8200,
    impressions: 45000,
    budget: '$1,800',
    platform: 'تويتر',
    created_at: '2026-06-15T00:00:00Z',
  },
  {
    id: 'ad-3',
    ad_config: {
      title: 'حملة العودة للمدارس',
      description: 'اشترك الآن في الباقة السنوية واستفد من خصم 30%',
      targetUrl: 'https://edu.ai-sahl.com/back-to-school',
      placement: 'bottom',
      display_space: 'Native',
      lang: 'ar',
      is_exclusive: false,
      is_fixed: false,
      cta_type: 'visit',
    },
    status: 'inactive',
    clicks: 15700,
    impressions: 120000,
    budget: '$3,200',
    platform: 'إنستغرام',
    created_at: '2026-07-01T00:00:00Z',
  },
]

export const killSwitchMock: KillSwitchState = {
  active: false,
  toggled_at: '',
}
