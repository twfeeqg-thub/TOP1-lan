# README_LOGIC.md — app/[sector_slug] (القالب الزجاجي الديناميكي)

## المنطق البشري (Human Logic)

هذا المسار هو **القلب الأجوف** للمنصة — قالب زجاجي (Glassmorphism) ديناميكي بالكامل:
- **لا يحتوي على أي نصوص ثابتة مطلقاً**: لا titles، لا descriptions، لا badges. كل شيء يُسحَب من JSONB المخزَّن في Supabase عبر `getSectorData()`.
- **مهمته الوحيدة**: جلب بيانات القطاع من السحابة (أو من الـ Mock Data في وضع Fallback) وعرضها عبر مكونات ديناميكية.
- **يدعم 3 ثيمات ديناميكية**: يتم تحديد السمة (Light / Dark / Glass) عبر متغيرات CSS (custom properties) التي تُقرأ من JSONB — الألوان، التدرجات، الشفافية، والـ backdrop blur كلها متغيرة.
- **إعلانات مدمجة في 3 مواضع**: (top, middle, bottom) يتم حقنها عبر `Ad_Renderer_Component` مع مراعاة عدم ظهورها في صفحات الاختبار.
- **قسري على عدم وجود محتوى ثابت**: لو رأى المطور نصاً عربياً أو إنجليزياً ثابتاً في هذا المسار، هذا خرق للدستور.

## الهيكل الآلي (Auto-Structure)

```
app/[sector_slug]/
└── page.tsx          ← الصفحة الوحيدة (Server Component + Suspense dynamic imports)
```

### تدفق العرض:
1. استخراج `sector_slug` من الـ URL
2. استدعاء `getSectorData(slug)` ← تجلب SectorData (JSONB) من Supabase أو Mock
3. تمرير البيانات إلى المكونات الديناميكية:
   - `DynamicHero` ← badge, title, description, CTAs, cover_image
   - `DynamicProjects` ← قائمة المشاريع مع icon, features, links
   - `DynamicAbout` ← النبذة مع highlights
   - `DynamicTestimonials` ← آراء المستخدمين
   - `DynamicFAQ` ← الأسئلة الشائعة
   - `DynamicPartners` ← شركاء القطاع
   - `DynamicLegalFooter` ← السياسات القانونية
4. حقن `Ad_Renderer_Component` في 3 مواضع (بعد Hero، بعد Projects، بعد FAQ)

## القواعد المطلقة
1. **صفر نصوص ثابتة** في هذا المسار — أي إضافة نص ثابت هو خرق دستوري.
2. الثيمات يجب أن تكون فقط عبر CSS Variables من JSONB — لا كلاس ثابت.
3. الـ Ad_Renderer يجب أن يكون في المواضع الثلاثة (top, middle, bottom).
4. استخدام `Suspense` مع الـ Ad_Renderer لمنع تعطيل الـ SSR.
5. في حالة Fallback، يجب عرض `FallbackBanner` للمستخدم.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **page.tsx**: يرتبط بـ [  |  |  |  |  |  ]
