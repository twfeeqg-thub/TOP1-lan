import { createClient } from '@supabase/supabase-js';

// Fallback values during build/missing configuration to prevent app crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safely initialize Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    db: {
      schema: 'core',
    },
  }
);

export interface ProjectDefinition {
  id: string | number;
  project_slug: string;
  sector_name: string;
  modules_config: {
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
    icon?: string;
    features_ar?: string[];
    features_en?: string[];
    accent_color?: string;
  };
  is_active: boolean;
}

// Highly polished, realistic mock data mirroring the 'project_definitions' table structure
// This provides a fallback state so the UI functions perfectly even if Supabase keys are not set yet.
export const fallbackProjects: ProjectDefinition[] = [
  {
    id: 1,
    project_slug: 'edu_schools',
    sector_name: 'سهل - ذكاء رقمي تعليمي',
    modules_config: {
      title_ar: 'نظام إدارة المدارس الذكية',
      title_en: 'Smart Schools Management System',
      description_ar: 'منصة تعليمية متكاملة لربط الفصول الدراسية وتتبع الأداء الأكاديمي والذكاء الاصطناعي التوليدي.',
      description_en: 'Integrated educational platform connecting classrooms, tracking academic performance, and generative AI.',
      icon: 'GraduationCap',
      features_ar: ['إدارة الفصول الذكية', 'تقارير أداء فورية', 'تكامل مع أدوات التقييم المستمر'],
      features_en: ['Smart Classroom Management', 'Real-time Performance Reports', 'Continuous Assessment Integration'],
      accent_color: 'from-blue-500 to-indigo-600',
    },
    is_active: true,
  },
  {
    id: 2,
    project_slug: 'edu_exam',
    sector_name: 'سهل - ذكاء رقمي تعليمي',
    modules_config: {
      title_ar: 'منصة الاختبارات الوطنية والتقييم',
      title_en: 'National Exams & Assessment Platform',
      description_ar: 'بوابة إلكترونية متطورة لإجراء وتقييم الاختبارات المعيارية والتحصيلية بدقة عالية وأمان فائق.',
      description_en: 'Advanced electronic portal for conducting and evaluating standardized tests with high security.',
      icon: 'FileText',
      features_ar: ['تصحيح تلقائي مدعوم بالذكاء', 'تحليلات القياس الإحصائي', 'بنوك أسئلة تصنيفية'],
      features_en: ['AI-powered Auto Grading', 'Statistical Measurement Analytics', 'Categorized Question Banks'],
      accent_color: 'from-cyan-500 to-blue-600',
    },
    is_active: true,
  },
  {
    id: 3,
    project_slug: 'edu_twin',
    sector_name: 'سهل - ذكاء رقمي تعليمي',
    modules_config: {
      title_ar: 'التوأم الرقمي التعليمي',
      title_en: 'Educational Digital Twin',
      description_ar: 'بيئة محاكاة تفاعلية ثلاثية الأبعاد لبناء وتجربة الأنظمة التعليمية والمختبرات الافتراضية السيادية.',
      description_en: 'Interactive 3D simulation environment for building virtual labs and sovereign educational structures.',
      icon: 'Orbit',
      features_ar: ['مختبرات فيزيائية افتراضية', 'محاكاة ثلاثية الأبعاد تفاعلية', 'تتبع تفاعل الطلاب بالواقع المعزز'],
      features_en: ['Virtual Physics Labs', 'Interactive 3D Simulation', 'Student AR Interaction Tracking'],
      accent_color: 'from-purple-500 to-indigo-600',
    },
    is_active: false,
  },
  {
    id: 4,
    project_slug: 'health_clinic',
    sector_name: 'سهل - ذكاء رقمي صحي',
    modules_config: {
      title_ar: 'منصة العيادات التخصصية والرعاية',
      title_en: 'Specialized Clinics & Care Platform',
      description_ar: 'نظام رقمي موحد لإدارة العيادات الطبية، الملفات الصحية الإلكترونية السيادية، والاستشارات الطبية عن بعد.',
      description_en: 'Unified digital system managing medical clinics, sovereign EHRs, and remote telemedicine consultation.',
      icon: 'HeartPulse',
      features_ar: ['الملف الطبي الإلكتروني السيادي', 'جدولة وتنسيق المواعيد الرقمية', 'التحليلات التنبؤية للأمراض'],
      features_en: ['Sovereign EHR Systems', 'Digital Appointment Scheduling', 'Predictive Medical Analytics'],
      accent_color: 'from-emerald-500 to-teal-600',
    },
    is_active: true,
  },
  {
    id: 5,
    project_slug: 'real_estate_portal',
    sector_name: 'سهل - ذكاء رقمي عقاري',
    modules_config: {
      title_ar: 'منصة العقارات الذكية وحلول الملكية',
      title_en: 'Smart Real Estate & Ownership Solutions',
      description_ar: 'نظام سيادي لرقمنة الأصول العقارية وتتبع الملكيات وإدارة العقود وتكامل البيانات الجيومكانية.',
      description_en: 'Sovereign system for real estate asset digitization, ownership tracking, contract management, and GIS integration.',
      icon: 'Building2',
      features_ar: ['عقود ذكية وموثقة', 'تكامل الخرائط والبيانات الجيومكانية', 'إدارة الاستثمار العقاري'],
      features_en: ['Authenticated Smart Contracts', 'GIS and Maps Integration', 'Real Estate Investment Management'],
      accent_color: 'from-amber-500 to-orange-600',
    },
    is_active: false,
  },
  {
    id: 6,
    project_slug: 'commerce_gateway',
    sector_name: 'سهل - ذكاء رقمي تجاري',
    modules_config: {
      title_ar: 'بوابة التجارة والأعمال الرقمية',
      title_en: 'Digital Business & Commerce Gateway',
      description_ar: 'حلول ذكية لتمكين التجارة الإلكترونية، المعاملات المالية الموحدة، وتتبع سلاسل الإمداد الوطنية.',
      description_en: 'Smart solutions enabling e-commerce, unified financial transactions, and national supply chain tracking.',
      icon: 'ShoppingBag',
      features_ar: ['تكامل المدفوعات السيادية', 'تتبع سلاسل الإمداد اللوجستية', 'لوحات تحكم تجارية متكاملة'],
      features_en: ['Sovereign Payment Integration', 'Logistics Supply Chain Tracking', 'Comprehensive Business Dashboards'],
      accent_color: 'from-rose-500 to-pink-600',
    },
    is_active: false,
  }
];
