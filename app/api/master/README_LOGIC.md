# README_LOGIC.md — app/api/master (لوحة القيادة المركزية)

## المنطق البشري (Human Logic)

مسارات لوحة الماستر هي الجسر الوحيد بين واجهة القيادة وقاعدة البيانات الحقيقية (سكيما `core`). القواعد الصارمة:
- **لا بيانات وهمية أبداً**: كل GET يستعلم من سكيما `core` مباشرة ويُرجع نفس عقد الرد الذي تستهلكه الواجهات (`{ data: [...] }`) فلا تتغير أي واجهة.
- **كل طفرة مُدقَّقة**: كل POST/PUT/PATCH/DELETE يكتب في القاعدة ثم يُسجِّل في `core.master_audit_log` عبر `logAudit()` من `lib/supabase-pool`.
- **العمود الفقري هو pg Pooler (6543)**: كل Route Handler هنا يعلن `export const runtime = 'nodejs'` ويستعلم عبر `pool` (pg.Pool على `DATABASE_URL`). إذا غاب `DATABASE_URL` يُرجع 503 — لا ارتداد للموك.
- **التعيينات**: مشاريع `project_definitions` تُعرَض كـ `name ← modules_config->>name_ar || project_slug` و `slug ← project_slug`. الإعلانات تحوّل `status` من عمود `status` أو `is_active`.

## القواعد المطلقة
1. لا يُستورد أي mock data في هذه المسارات.
2. أي خطأ قاعدة يُطبع بـ `console.error` ثم يُرجع 500 — لا إخفاء صامت.
3. لا WebSockets، لا Edge runtime (يتطلب `nodejs` لاستخدام `pg`).
