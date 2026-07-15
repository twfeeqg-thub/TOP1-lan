import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// قراءة متغيرات البيئة من ملف .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ خطأ: لم يتم العثور على متغيرات البيئة. تأكد من وجود ملف .env.local');
  process.exit(1);
}

// تهيئة عميل الخادم مع التوجيه الإجباري لسكيما (core) لحل مشكلة عدم العثور على الجداول
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'core' },
  auth: { persistSession: false },
});

// تجهيز بيانات القطاعات والمشاريع بناءً على المعمارية
const seedProjects = [
  { project_slug: 'edu_schools', sector_name: 'سهل - ذكاء رقمي تعليمي', modules_config: { feature: 'إدارة المدارس الأهلية' }, is_active: true },
  { project_slug: 'edu_exam', sector_name: 'سهل - ذكاء رقمي تعليمي', modules_config: { feature: 'محرك الاختبارات' }, is_active: true },
  { project_slug: 'edu_twin', sector_name: 'سهل - ذكاء رقمي تعليمي', modules_config: { feature: 'توأم المعلم الذكي' }, is_active: true },
  { project_slug: 'health_clinic', sector_name: 'سهل - ذكاء رقمي صحي', modules_config: { feature: 'إدارة العيادات' }, is_active: false }
];

async function runSeed() {
  console.log('🚀 بدء عملية تهيئة وحقن البيانات الأساسية في سكيما (core)...');

  for (const project of seedProjects) {
    const { error } = await supabase
      .from('project_definitions')
      .upsert(project, { onConflict: 'project_slug' });

    if (error) {
      console.error(`❌ فشل حقن المشروع (${project.project_slug}):`, error.message);
    } else {
      console.log(`✅ تم حقن المشروع بنجاح: ${project.project_slug}`);
    }
  }

  console.log('🎉 اكتملت عملية الحقن بنجاح!');
}

runSeed();
