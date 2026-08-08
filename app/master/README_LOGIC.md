# README_LOGIC.md — app/master (لوحة القيادة والسيادة)

## المنطق البشري (Human Logic)

لوحة الماستر هي:
- **مركز القيادة والسيادة (Command & Control Center)**: تتحكم بالكامل في جميع القطاعات (sectors)، المشاريع (projects)، الميزات (features)، والإعلانات (ads).
- **صفر كود لتشغيل قطاع جديد**: إضافة قطاع جديد لا يتطلب أي كتابة كود. فقط إدخال JSONB عبر واجهة الماستر، والقالب الزجاجي (app/[sector_slug]) سيعرضه تلقائياً.
- **التحكم عبر JSONB**: كل شيء — القطاعات، المشاريع، الإعلانات، الميزات، حتى الـ Kill Switch للإعلانات — يُدار عبر جداول JSONB في Supabase.
- **صلاحيات صارمة**: الدخول محصور على role = 'super_admin' فقط. الـ Middleware يحمي كل المسارات تحت /master/* و /api/master/*.
- **سجل تدقيق (Audit Log)**: جميع العمليات الحساسة تُسجل في Audit Log للتتبع والمساءلة.
- **التزامن اللحظي (Phase 3)**: `MasterLayoutV2` يشغّل `useMasterRealtime` — أي تغيّر Postgres على جداول `core` يُبطل كيانات React Query تلقائياً.
- **محرك التخطيط الديناميكي (Phase 3)**: لوحة القيادة تستهلك `DynamicSectorsGrid` و `DynamicProjectsGrid` من `components/layout-engine` — لا بيانات وهمية، وبطاقات زجاجية حية مرتّبة حسب `display_order`.
- **النماذج الموحّدة (Phase 3)**: صفحة `/master/forms` تشغّل معالجات إنشاء القطاعات/المشاريع/الإعلانات عبر `MasterCreateWizard` + `DynamicForm` من مخططات `lib/forms/*`.

## الهيكل الآلي (Auto-Structure)

```
app/master/
├── page.tsx                       ← لوحة المعلومات الرئيسية (Dashboard) + الشبكات الديناميكية
├── layout.tsx                     ← هيكل الماستر مع التحقق من الصلاحية
├── login/page.tsx                 ← صفحة دخول الماستر
├── forms/page.tsx                 ← إنشاء جديد (قطاع/مشروع PWA/حملة إعلانية)
├── sectors/
│   ├── page.tsx                   ← إدارة القطاعات
│   └── [sectorId]/page.tsx        ← تفاصيل قطاع معين
├── projects/page.tsx              ← إدارة المشاريع
├── features/page.tsx              ← إدارة الميزات
├── ads/page.tsx                   ← إدارة الإعلانات
├── components/                    ← مكونات واجهة الماستر
│   ├── sidebar-logo.tsx
│   ├── nav-items.tsx
│   ├── stats-card.tsx
│   └── sectors/                   ← نماذج إدارة JSONB للقطاعات (SectorFormWrapper ذو التبويبات السبعة)
└── versions/v2/                   ← تطور واجهة الماستر (MasterLayout + Realtime)
```

## القواعد المطلقة
1. لا إضافة قطاع جديد عبر الكود — فقط عبر واجهة الماستر → JSONB.
2. الحماية عبر middleware إلزامية لجميع مسارات /master/*.
3. الـ Audit Log يجب أن يغطي كل عملية تعديل أو حذف.
4. أي تغيير في JSONB للقطاع ينعكس فوراً على القالب الزجاجي دون إعادة نشر.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **layout.tsx**: يرتبط بـ [  |  |  |  ]
- **page.tsx**: يرتبط بـ [  |  |  |  |  |  |  |  |  ]
