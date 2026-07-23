# جدول متابعة تطوير منصة "ذكاء سهل" 🚀

جدول زمني وتتبع المهام المعمارية والفنية لمنصة **ذكاء سهل** السحابية متعددة المستأجرين.

## 📋 حالة المهام الإجمالية

- [x] **الخطوة 1: تهيئة الهوية البصرية الموحدة (CSS)**
  - [x] بناء نظام الثيمات الثلاثي (`light`, `dark`, `pink`) في `app/globals.css`.
  - [x] إعداد فئات الـ Glassmorphic الأنيقة وسلسلة المتغيرات اللونية لكل ثيم.
  - [x] ضبط الاتجاه الافتراضي ليكون RTL ولغة الموقع العربية.
- [x] **الخطوة 2: تحديث الملف الأساسي للتخطيط (`app/layout.tsx`)**
  - [x] تحديث العنوان وصياغة الميتا لـ "ذكاء سهل".
  - [x] إعداد خاصية الـ `suppressHydrationWarning` وضبط سمات الـ `html` (العربية + RTL).
- [x] **الخطوة 3: بناء محرك عرض وتوجيه القطاعات الديناميكي (`app/page.tsx`)**
  - [x] مصفوفة بيانات القطاعات (Data-Driven Architecture) للفصل بين العرض والبيانات.
  - [x] تصميم بطاقة القطاع التفاعلية تدعم التوجيه المباشر أو الفتح التفاعلي.
- [x] **الخطوة 4: تطوير الواجهات الفرعية والمنبثقة التفاعلية**
  - [x] نافذة منبثقة (Modal) زجاجية أنيقة للقطاعات قيد الإنشاء.
  - [x] نموذج المقترحات التفاعلي (مساحة النص، حقل التواصل، زر الإرسال مع حالة النجاح).
- [x] **الخطوة 5: مكون الإعلانات الموحد (`Ad_Renderer_Component`)**
  - [x] دمج المكون كطابور عرض ديناميكي في نقاط استراتيجية بدون تشغيل تلقائي للفيديو.
- [x] **الخطوة 6: التذييل القانوني المتوافق مع متطلبات Meta Verification**
  - [x] تذييل يحتوي على إشعارات توضيحية لـ WhatsApp Business API، إثبات النشاط التجاري، وروابط السياسات القانونية.
- [x] **الخطوة 7: المراجعة النهائية واختبار التجميع**
  - [x] فحص كود التجميع والتأكد من خلوه من أي أخطاء `compile_applet`.
  - [x] تشغيل الفاحص البرمجي `lint_applet`.

---

## 🏗️ الخطوة 8: بوابة المصادقة المركزية

> **الحالة:** 🟢 تم البناء — في انتظار اختبار API

### الملفات المُنشأة

| المسار | الوصف |
|--------|-------|
| **مكتبات أساسية** | |
| `lib/phone.ts` | تسوية الأرقام إلى +967 عبر libphonenumber-js |
| `lib/auth.ts` | JWT, bcrypt, helpers التوكن والكوكيز |
| `lib/validators.ts` | Zod schemas للمدخلات |
| `lib/supabase-pool.ts` | Admin client عبر Supavisor |
| **Context** | |
| `context/AuthContext.tsx` | AuthProvider + useAuth — إدارة access_token في الذاكرة (sessionStorage) |
| **API Routes** | |
| `app/api/auth/register/route.ts` | POST ← تسجيل + HttpOnly cookie |
| `app/api/auth/login/route.ts` | POST ← دخول + توجيه super_admin إلى /master |
| `app/api/auth/refresh/route.ts` | POST ← قراءة cookie → access_token جديد |
| `app/api/auth/logout/route.ts` | POST ← إبطال الجلسة + مسح cookie |
| `app/api/auth/check-phone/route.ts` | GET ← التحقق من توفر الهاتف |
| `app/api/auth/push-token/route.ts` | POST ← حفظ FCM push token |
| **مكونات UI** | |
| `components/auth/GlassInput.tsx` | Input بنمط glassmorphism |
| `components/auth/GlassButton.tsx` | Button (primary/secondary/ghost) مع loading |
| `components/auth/PhoneInput.tsx` | حقل هاتف مع +967 وقفل اتجاه RTL |
| `components/auth/PasswordInput.tsx` | حقل كلمة سر مع toggle visibility |
| `components/auth/ThemeSwitcher.tsx` | أزرار light/dark/pink |
| `components/auth/ServiceHeader.tsx` | عرض معلومات الخدمة من API |
| `components/auth/BrandSide.tsx` | الجانب البصري split-screen |
| `components/auth/AuthSplitLayout.tsx` | Layout النصفين (desktop) |
| **الصفحات** | |
| `app/login/page.tsx` | بوابة الدخول العامة (?service= إلزامي) |
| `app/register/page.tsx` | بوابة التسجيل مع debounced validation |
| `app/master/login/page.tsx` | بوابة دخول لوحة الماستر |
| **قاعدة البيانات** | |
| `scripts/migration_auth.sql` | إنشاء جداول users + sessions في schema core |

### التعديلات بعد المراجعة

- [x] **إشعارات FCM**: إضافة `push_tokens` (JSONB) إلى جدول users + API route تخزين
- [x] **تصحيح الهلوسة التقنية**: Supabase JS Client (REST) للواجهات، pooler للاستعلامات المباشرة
- [x] **التوجيه السيادي**: إذا role=super_admin → `/master` بعد تسجيل الدخول

### 🔴 قبل الاختبار — يجب تنفيذ

- [ ] تشغيل `scripts/migration_auth.sql` في Supabase SQL Editor
- [ ] إضافة `DATABASE_URL` (pooler) في `.env.local` للاستعلامات المباشرة (اختياري)
