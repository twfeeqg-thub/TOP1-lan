import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../lib/auth';
import { normalizePhone } from '../lib/phone';
import { EDUCATIONAL_PROJECT_SLUGS } from '../lib/subscriptions';

dotenv.config({ path: '.env.local' });

const name = process.env.SEED_OWNER_NAME;
const phone = process.env.SEED_OWNER_PHONE;
const password = process.env.SEED_OWNER_PASSWORD;

if (!name || !phone || !password) {
  console.error(
    '❌ خطأ: متغيرات SEED_OWNER_NAME / SEED_OWNER_PHONE / SEED_OWNER_PASSWORD مفقودة.\n' +
      'أضفها إلى ملف .env.local قبل تشغيل سكربت الحقن. لا تُكتب الاعتماديات في الكود أبداً.'
  );
  process.exit(1);
}

if (password.length < 10) {
  console.error('❌ خطأ: كلمة مرور المالك يجب ألا تقل عن 10 أحرف.');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ خطأ: لم يتم العثور على متغيرات بيئة Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'core' },
  auth: { persistSession: false },
});

async function seedOwner() {
  console.log('🚀 بدء حقن المالك السيادي (super_admin)...');

  let normalizedPhone: string;
  try {
    normalizedPhone = normalizePhone(phone!);
  } catch {
    console.error(`❌ خطأ: رقم الهاتف غير صالح: ${phone}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password!, SALT_ROUNDS);

  const { data: existing } = await supabase
    .from('users')
    .select('id, role, name')
    .eq('phone', normalizedPhone)
    .maybeSingle();

  let ownerId: string;
  let action: 'created' | 'updated';

  if (existing) {
    if (existing.role !== 'super_admin') {
      console.error('❌ خطأ: رقم الهاتف مسجل بدور مختلف. لن نقوم بالترقية التلقائية حفاظاً على الأمان.');
      process.exit(1);
    }
    const { error } = await supabase
      .from('users')
      .update({ name: name!, password_hash: passwordHash })
      .eq('id', existing.id);
    if (error) {
      console.error('❌ فشل تحديث المالك:', error.message);
      process.exit(1);
    }
    ownerId = existing.id as string;
    action = 'updated';
  } else {
    const { data: inserted, error } = await supabase
      .from('users')
      .insert({
        phone: normalizedPhone,
        name: name!,
        password_hash: passwordHash,
        role: 'super_admin',
        is_active: true,
        push_tokens: [],
        metadata: {},
      })
      .select('id')
      .single();
    if (error || !inserted) {
      console.error('❌ فشل إنشاء المالك:', error?.message);
      process.exit(1);
    }
    ownerId = inserted.id as string;
    action = 'created';
  }

  const { error: subError } = await supabase.from('user_subscriptions').upsert(
    EDUCATIONAL_PROJECT_SLUGS.map((slug) => ({
      user_id: ownerId,
      project_slug: slug,
      plan: 'enterprise',
      is_active: true,
      expires_at: null,
    })),
    { onConflict: 'user_id,project_slug' }
  );

  if (subError) {
    console.error(`❌ فشل حقن الاشتراكات: ${subError.message}`);
  }

  await supabase.from('master_audit_log').insert({
    action: action === 'created' ? 'owner_seeded' : 'owner_seed_updated',
    user_id: ownerId,
    entity_type: 'user',
    entity_id: ownerId,
    details: `Sovereign owner seeded (${action}) with enterprise subscriptions for ${EDUCATIONAL_PROJECT_SLUGS.length} projects`,
    severity: 'high',
  });

  console.log(`✅ تم ${action === 'created' ? 'إنشاء' : 'تحديث'} المالك السيادي بنجاح!`);
  console.log(`👤 الاسم: ${name}`);
  console.log(`📱 الهاتف (E.164): ${normalizedPhone}`);
  console.log(`🔐 الدور: super_admin — يتجاوز كل بوابات المصادقة`);
  console.log(`🎟️ اشتراكات (enterprise): ${EDUCATIONAL_PROJECT_SLUGS.join(', ')}`);
}

seedOwner();
