import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Define the sector definitions with localized Arabic values, custom configurations, colors, and icons
const SECTOR_DATA = [
  {
    id: 'f9d3fbc0-90da-4a57-b4d6-1bb9c07cf3b1',
    key: 'education',
    name: 'التعليم',
    description: 'منصة مركزية ذكية لإدارة الأنظمة التعليمية، المدارس، شؤون الطلاب، المعلمين والتقارير الأكاديمية.',
    icon: 'graduation-cap',
    color: '#3b82f6', // Blue
    config: {
      features: ['student_management', 'teacher_records', 'gradebooks', 'exam_schedules', 'e_learning'],
      default_widgets: ['total_students', 'active_classes', 'attendance_rate', 'gpa_average'],
      theme_mode: 'light',
      version: '1.0.0'
    },
    status: 'active'
  },
  {
    id: 'b5f63d91-cd21-4f10-9cb0-3ee9c1e0b512',
    key: 'health',
    name: 'الصحة',
    description: 'نظام متكامل للمنشآت الصحية والطبية، وإدارة السجلات الإلكترونية للمرضى، والمواعيد، والأطباء.',
    icon: 'activity',
    color: '#10b981', // Emerald
    config: {
      features: ['patient_records', 'appointment_booking', 'doctor_shifts', 'prescription_management', 'billing'],
      default_widgets: ['total_patients', 'appointments_today', 'active_doctors', 'occupancy_rate'],
      theme_mode: 'light',
      version: '1.0.0'
    },
    status: 'active'
  },
  {
    id: 'd4b79c88-e24e-4f1d-b5e1-2dd98012674e',
    key: 'real_estate',
    name: 'العقارات',
    description: 'لوحة تحكم عقارية شاملة لإدارة الأصول والممتلكات، الوحدات السكنية، المبيعات والتعاقدات الاستثمارية.',
    icon: 'building',
    color: '#f97316', // Orange
    config: {
      features: ['property_listings', 'tenant_management', 'lease_agreements', 'payment_tracking', 'maintenance'],
      default_widgets: ['active_listings', 'occupancy_status', 'monthly_revenue', 'pending_requests'],
      theme_mode: 'light',
      version: '1.0.0'
    },
    status: 'active'
  },
  {
    id: '3c1e5a8b-12d4-4a5e-99f9-d5916027c9bc',
    key: 'commerce',
    name: 'التجارة',
    description: 'منصة إدارة العمليات التجارية المتكاملة، المبيعات، المخازن، المشتريات والتقارير المالية الدقيقة.',
    icon: 'shopping-bag',
    color: '#6366f1', // Indigo
    config: {
      features: ['inventory_tracking', 'sales_orders', 'supplier_management', 'invoice_generation', 'analytics'],
      default_widgets: ['daily_sales', 'low_stock_items', 'pending_shipments', 'revenue_growth'],
      theme_mode: 'light',
      version: '1.0.0'
    },
    status: 'active'
  }
];

async function seed() {
  console.log('🚀 بدء عملية تهيئة وحقن البيانات الأساسية لمنصة "ذكاء سهل"...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ خطأ: لم يتم العثور على متغيرات البيئة الخاصة بـ Supabase.');
    console.error('الرجاء التأكد من تعيين NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  // Initialize client targeting the "core" schema as requested
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    db: {
      schema: 'core'
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  try {
    console.log(`🔌 تم الاتصال بـ Supabase على الرابط: ${supabaseUrl}`);
    console.log(`📁 استهداف سكيما (core) والجدول (project_definitions)...`);

    // Perform Idempotent Upsert using the unique key / id
    const { data, error } = await supabase
      .from('project_definitions')
      .upsert(SECTOR_DATA, {
        onConflict: 'key', // Prevent duplication by key
        ignoreDuplicates: false // We want to update them if they changed (Idempotent Upserting)
      })
      .select();

    if (error) {
      // If the schema 'core' does not exist or we get a schema error, let's try fallback to public or log detailed error
      console.warn(`⚠️ تنبيه: فشل الحقن المباشر في السكيما 'core' (قد لا تكون السكيما مهيأة بعد).`);
      console.warn(`تفاصيل الخطأ: ${error.message}`);
      
      console.log('🔄 محاولة تجربة الحقن في السكيما الافتراضية "public" كخيار احتياطي...');
      const publicSupabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });

      const { data: publicData, error: publicError } = await publicSupabase
        .from('project_definitions')
        .upsert(SECTOR_DATA, {
          onConflict: 'key'
        })
        .select();

      if (publicError) {
        throw new Error(`فشل الحقن في كلا الخيارين (core & public): ${publicError.message}`);
      }

      console.log('✅ تم حقن البيانات بنجاح في السكيما "public" (الخيار الاحتياطي):');
      console.table(publicData?.map(item => ({ id: item.id, key: item.key, name: item.name, status: item.status })));
    } else {
      console.log('✅ تم حقن البيانات بنجاح في السكيما "core":');
      console.table(data?.map(item => ({ id: item.id, key: item.key, name: item.name, status: item.status })));
    }

    console.log('🎉 اكتملت عملية حقن البيانات الأساسية (Phase 0) بنجاح!');
  } catch (err: any) {
    console.error('❌ حدث خطأ غير متوقع أثناء عملية الحقن:');
    console.error(err.message || err);
    process.exit(1);
  }
}

seed();
