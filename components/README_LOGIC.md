# README_LOGIC.md — components/ad-renderer.tsx (بروتوكول حقن الإعلانات الموحد)

## المنطق البشري (Human Logic)

الإعلانات في منصة ذكاء سهل ليست مجرد مكون — هي **طابور عرض ديناميكي (Dynamic Ad Queue)** يُزرع في كل القطاعات والمشاريع تلقائياً:
- **بروتوكول الحقن الموحد (Unified Injection Protocol)**: مكون `Ad_Renderer_Component` هو نقطة الحقن الوحيدة للإعلانات في كل المنصة. لا يوجد مكون إعلانات آخر.
- **طابور ديناميكي**: الإعلانات تُسحَب من جدول `ads_engine` (JSONB في Supabase) مع دعم الـ Fallback إلى 6 إعلانات تجريبية (3 عربي + 3 إنجليزي) في حالة عدم الاتصال.
- **Kill Switch**: يوجد مفتاح قتل مركزي (Kill Switch) عبر API `/api/master/ads/kill-switch` لإيقاف جميع الإعلانات فورياً في المنصة بأكملها — لأغراض الصيانة أو الامتثال.
- **المنع القطعي في حلبات الاختبار**: إذا كان المستخدم من النوع `isPremiumUser` أو `audience = 'student'` في سياق الاختبارات، لا يتم عرض الإعلانات قطعياً لمنع تشتيت الطلاب.
- **3 مواضع عرض**: top, middle, bottom — يتم تحديدها عبر `placement` prop.

## الهيكل الآلي (Auto-Structure)

```
components/
├── ad-renderer.tsx        ← مكون الإعلانات الرئيسي (الوحيد)
└── sector/                ← مكونات عرض القطاع (تستضيف الإعلانات داخلها)
```

### تدفق عمل Ad_Renderer_Component:
1. فحص `isPremiumUser` → إذا true، يرجع null فوراً
2. استدعاء Kill Switch API (`/api/master/ads/kill-switch`) — غير متزامن
3. إذا Kill Switch Active → يرجع null
4. فلترة الإعلانات حسب `placement` و `lang`
5. إذا لا يوجد إعلانات مطابقة → توسيع الفلتر تدريجياً (إزالة placement ثم lang)
6. عرض الإعلان (Slider مع Auto-rotate كل 5 ثوانٍ)
7. إذا إعلان مثبت (is_fixed أو is_exclusive) → عرضه فقط بدون Slider

## القواعد المطلقة
1. **المنع القطعي لعرض الإعلانات داخل حلبات الاختبار** (حيث audience=student أو isPremiumUser) — هذا أولوية قصوى.
2. البروتوكول موحد — **لا يجوز إنشاء مكون إعلانات آخر** في أي مكان في المنصة.
3. Kill Switch يجب أن يُفحَص في كل مرة يُحمَّل فيها المكون (وليس مرة واحدة فقط).
4. الـ Fallback Ads الـ 6 موجودة لضمان استمرارية العرض حتى بدون اتصال.
5. الـ Slider يجب أن يعيد تشغيل الـ Timer بعد كل تفاعل يدوي (next/prev).

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **Header.tsx**: يرتبط بـ [  |  |  ]
- **ad-renderer.tsx**: يرتبط بـ [  |  |  |  ]
- **offline-banner.tsx**: يرتبط بـ [  |  |  |  ]
- **service-worker-register.tsx**: يرتبط بـ [  ]
