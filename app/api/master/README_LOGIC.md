# README_LOGIC.md — app/api/master (لوحة القيادة المركزية)

## المنطق البشري (Human Logic)

مسارات لوحة الماستر هي الجسر الوحيد بين واجهة القيادة وقاعدة البيانات الحقيقية (سكيما `core`). القواعد الصارمة:
- **لا بيانات وهمية أبداً**: كل GET يستعلم من سكيما `core` مباشرة ويُرجع نفس عقد الرد الذي تستهلكه الواجهات (`{ data: [...] }`) فلا تتغير أي واجهة.
- **كل طفرة مُدقَّقة**: كل POST/PUT/PATCH/DELETE يكتب في القاعدة ثم يُسجِّل في `core.master_audit_log` عبر `logAudit()` من `lib/supabase-pool`.
- **الهوية السيادية (Phase 2)**: كل طفرة تستدعي `resolveMasterActorFromRequest()` من `lib/auth-session` — تقرأ الـ access_token الموقَّع (Header أو كوكي `aisahl_access_token`) وتتحقق من المستخدم النشط في `core.users`. عند غيابها تُرجع **401** — لا عمليات مجهولة. لا تُقبل هوية من جسم الطلب أبداً. تُسجَّل `user_id` و `actor_role` في كل إدخال تدقيق.
- **المعاملات الصارمة (Phase 3)**: كل POST/PUT/PATCH/DELETE في مسارات القطاعات/المشاريع/الميزات/الإعلانات/الطلبات تُنفَّذ عبر `withMasterTx(actor, fn)` من `lib/master-tx` — اتصال مخصص من pooler 6543 مع `BEGIN…COMMIT/ROLLBACK`: **كتابة العمل وإدخال `core.master_audit_log` في معاملة واحدة** فلا إدخال تدقيق يتيم ولا حالة جزئية أبداً. `MasterTxError` يحمل رمز HTTP، وأخطاء `*_NOT_FOUND` تُترجم إلى 404.
- **الترتيب الحتمي (Phase 3)**: GET للقطاعات والمشاريع يقرأ `display_order` (عمود ترحيل Phase 3) مع فهارس B-Tree مركّبة، والقطاعات تضيف `description` مستخرجة من `full_data->'hero'` لبطاقات محرك التخطيط.
- **مستويات موحّدة**: `severity` على مقياس `info / medium / high` فقط — تُفرض في `logAudit()` وبقيد CHECK في القاعدة.
- **العمود الفقري هو pg Pooler (6543)**: كل Route Handler هنا يعلن `export const runtime = 'nodejs'` ويستعلم عبر `pool` (pg.Pool على `DATABASE_URL`). إذا غاب `DATABASE_URL` يُرجع 503 — لا ارتداد للموك.
- **التعيينات**: مشاريع `project_definitions` تُعرَض كـ `name ← modules_config->>name_ar || project_slug` و `slug ← project_slug`. الإعلانات تحوّل `status` من عمود `status` أو `is_active`.
- **محرك الـ Overrides (Phase 1)**: جدول `core.project_overrides` يربط `tenant_id` بالمشروع ويخزّن فقط فروقات التخصيص المرئي/التخطيطي في عمود JSONB `config_override` (Delta Overrides). خط الأساس المعياري يبقى في `core.project_definitions.modules_config`. أي كتابة عليه تُدقَّق تلقائياً في `core.master_audit_log` عبر trigger قاعدة البيانات (إنشاء/تحديث/حذف) مع فرق قديم ← جديد.
- **آلية إدارة الـ Overrides**: يتم الحقن/التحديث برمجياً عبر `npm run db:migrate:overrides` (سكربت `scripts/migrate-overrides.ts` على pooler 6543) — لا خطوات يدوية عبر DBeaver أو SQL Editor.
- **محرك الإحصائيات (Phase 2)**: `GET /api/master/stats` يستعلم عبر CTE من `lib/stats.ts` ويُخدَّم من خلال ذاكرة TTL (60 ثانية) مع single-flight في `lib/kpi-cache.ts` — مع `Cache-Control: s-maxage=30`.
- **سجل التدقيق المباشر (Phase 2)**: `GET /api/master/audit` يجلب من `core.master_audit_log` مع JOIN على `core.users` لعرض اسم الفاعل، ويحوّل الإجراءات/الأنواع إلى تسميات عربية عبر `lib/audit-log.ts`.
- **المزامنة الصاعدة (Phase 2)**: `POST /api/master/sync/outbox` يعيد تطبيق الطفرات المؤجلة من الـ outbox المحلي (Dexie) بشكل تعاملي (Transaction) مع مفتاح `client_mutation_id` للتفرد — لا تطبيق مكرر أبداً، ويُسجِّل إدخال تدقيق `outbox.apply` بنفس المعاملة.

## القواعد المطلقة
1. لا يُستورد أي mock data في هذه المسارات.
2. أي خطأ قاعدة يُطبع بـ `console.error` ثم يُرجع 500 — لا إخفاء صامت.
3. لا WebSockets، لا Edge runtime (يتطلب `nodejs` لاستخدام `pg`).
4. لا طفرة بدون فاعل موثوق — 401 فوراً عند غياب الـ actor.
