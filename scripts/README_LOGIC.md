# README_LOGIC.md — scripts (الحقن البرمجي والترحيلات)

## المنطق البشري (Human Logic)

مجلد السكربتات هو نقطة التحكم السيادية لقاعدة البيانات: لا حقن يدوي عبر DBeaver أو SQL Editor أبداً — كل تغيير يُنفَّذ برمجياً من `.env.local` بقاعدة واحدة قابلة للتكرار (Idempotent).

- **الترحيلات (`.sql`)**: نصوص متطابقة (Idempotent) آمنة لإعادة التشغيل، تُنفَّذ كمعاملة واحدة (Transaction) عبر سكربت TypeScript.
- **الحارس الدفاعي (Drift Guard)**: `migration_overrides.sql` يضمن وجود `core.project_definitions` و `core.master_audit_log` قبل بناء `core.project_overrides` — يسد فجوة الإنشاء خارج النطاق التي سببتها أدوات خارجية سابقاً.
- **اتصال آمن فقط**: أي سكربت يمس القاعدة يجب أن يتحقق أن `DATABASE_URL` يستهدف منفذ pooler **6543** ويرفض أي منفذ آخر، مع `ssl: { rejectUnauthorized: false }`.
- **التحقق بعد الحقن**: كل سكربت يتأكد من نجاح الحقن عبر `information_schema` ويطبع تأكيداً أخضر قبل `COMMIT`، وإلا `ROLLBACK` كامل بدون أي حالة جزئية.

## الهيكل الآلي (Auto-Structure)

- **migration_overrides.sql**: ترحيل Phase 1 — جدول `core.project_overrides` (Delta JSONB) + فهارس GIN + RLS + Grants + triggers التدقيق الجنائي (`core.master_audit_log`) + `NOTIFY pgrst`.
- **migrate-overrides.ts**: مشغّل الحقن البرمجي عبر مكتبة `pg` — يقرأ `.env.local`، يتحقق من المنفذ 6543، ينفذ SQL داخل `BEGIN/COMMIT/ROLLBACK`، ويتحقق عبر `information_schema.tables/columns`.
- **migration_audit_phase2.sql**: ترحيل Phase 2 — أعمدة جنائية جديدة على `core.master_audit_log` (`performed_at`, `actor_role`, `client_mutation_id`) + توحيد المستويات على `info/medium/high` (مع قيد CHECK وفهارس: entity/created/user/client-mutation) + جدول `core.master_outbox` (Sink المزامنة الصاعدة مع RLS/Grants) + إعادة تعريف trigger الـ overrides لكتابة المستويات الموحدة.
- **migrate-audit-phase2.ts**: مشغّل ترحيل Phase 2 بنفس نمط Phase 1 — يتحقق من المنفذ 6543 ويدير `BEGIN/COMMIT/ROLLBACK` ويطبع الأعمدة + توزيع المستويات بعد التوحيد.
- **migration_phase3.sql**: ترحيل Phase 3 — `display_order INTEGER NOT NULL DEFAULT 0` على `core.sectors` و `core.project_definitions` + فهارس B-Tree مركّبة (`display_order ASC, created_at ASC`) لضمان فرز حتمي مستقر على المتصفحات الحدودية + `NOTIFY pgrst`.
- **migrate-phase3.ts**: مشغّل ترحيل Phase 3 (مسجّل كـ `db:migrate:phase3`) — يتحقق من المنفذ 6543، ينفذ SQL داخل `BEGIN/COMMIT/ROLLBACK`، ويتحقق عبر `information_schema.columns` و `pg_indexes` قبل التأكيد الأخضر.
- **seed.ts / seed-owner.ts**: حقن البيانات الأساسية والمالك السيادي.
- **migration_auth.sql / migration_subscriptions.sql / migration_live_connect.sql / remediation_qa_fix.sql**: ترحيلات الهوية والتعددية والاتصال المباشر والإصلاحات.
- **generate-dna.js**: ينسج الشبكة العنكبوتية (AUTO_STRUCTURE) في مجلدات `app` و `components` و `lib` و `hooks`.

## القواعد المطلقة
1. لا تُكتب الاعتماديات في الكود أبداً — تُقرأ من `.env.local` فقط.
2. أي تغيير في المخطط (DDL/DCL) يجب أن يكون idempotent ومغلفاً بمعاملة واحدة.
3. الحفظ من المنفذ 6543 إلزامي — الرفض عند أي انحراف.
4. لا تُنفَّذ ترحيلات على بيئة مباشرة (5432) من هذا المجلد.
