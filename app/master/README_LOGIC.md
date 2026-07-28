# README_LOGIC.md — app/master (لوحة القيادة والسيادة)

## المنطق البشري (Human Logic)

لوحة الماستر هي:
- **مركز القيادة والسيادة (Command & Control Center)**: تتحكم بالكامل في جميع القطاعات (sectors)، المشاريع (projects)، الميزات (features)، والإعلانات (ads).
- **صفر كود لتشغيل قطاع جديد**: إضافة قطاع جديد لا يتطلب أي كتابة كود. فقط إدخال JSONB عبر واجهة الماستر، والقالب الزجاجي (app/[sector_slug]) سيعرضه تلقائياً.
- **التحكم عبر JSONB**: كل شيء — القطاعات، المشاريع، الإعلانات، الميزات، حتى الـ Kill Switch للإعلانات — يُدار عبر جداول JSONB في Supabase.
- **صلاحيات صارمة**: الدخول محصور على role = 'super_admin' فقط. الـ Middleware يحمي كل المسارات تحت /master/* و /api/master/*.
- **سجل تدقيق (Audit Log)**: جميع العمليات الحساسة تُسجل في Audit Log للتتبع والمساءلة.

## الهيكل الآلي (Auto-Structure)

```
app/master/
├── page.tsx                       ← لوحة المعلومات الرئيسية (Dashboard)
├── layout.tsx                     ← هيكل الماستر مع التحقق من الصلاحية
├── login/page.tsx                 ← صفحة دخول الماستر
├── sectors/
│   ├── page.tsx                   ← إدارة القطاعات
│   └── [sectorId]/page.tsx        ← تفاصيل قطاع معين
├── projects/page.tsx              ← إدارة المشاريع
├── features/page.tsx              ← إدارة الميزات
├── ads/page.tsx                   ← إدارة الإعلانات
├── users/page.tsx                 ← إدارة المستخدمين
├── settings/page.tsx              ← إعدادات المنصة
├── components/                    ← مكونات واجهة الماستر
│   ├── sidebar-logo.tsx
│   ├── nav-items.tsx
│   ├── stats-card.tsx
│   └── sectors/                   ← نماذج إدارة JSONB للقطاعات
└── versions/v2/                   ← تطور واجهة الماستر (MasterLayout)
```

## القواعد المطلقة
1. لا إضافة قطاع جديد عبر الكود — فقط عبر واجهة الماستر → JSONB.
2. الحماية عبر middleware إلزامية لجميع مسارات /master/*.
3. الـ Audit Log يجب أن يغطي كل عملية تعديل أو حذف.
4. أي تغيير في JSONB للقطاع ينعكس فوراً على القالب الزجاجي دون إعادة نشر.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **layout.tsx**: يرتبط بـ [  |  |  |  ]
- **page.tsx**: يرتبط بـ [  |  |  |  |  |  ]
