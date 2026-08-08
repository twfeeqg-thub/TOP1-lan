# README_LOGIC.md — components/layout-engine (محرك التخطيط الديناميكي)

## المنطق البشري (Human Logic)

محرك التخطيط الديناميكي (Phase 3) هو طبقة العرض الوحيدة للقطاعات والمشاريع في لوحة الماستر:

- **DynamicSectorsGrid / DynamicProjectsGrid**: تستهلك `/api/master/sectors` و `/api/master/projects` عبر React Query (مفاتيح `master-sectors` / `master-projects`) — لا موك ثابت أبداً. أي تغيّر في `core.sectors` أو `core.project_definitions` يُبطل الكاش تلقائياً عبر `useMasterRealtime` (بلا أزرار تحديث يدوية).
- **resolveIcon / ICON_REGISTRY**: حلّ الأيقونات الديناميكي من `lib/icons.ts` بأسماء lucide مخزّنة في القاعدة، مع ارتداد آمن إلى `FolderKanban` لأي اسم مجهول. القطع تستخدم البحث الثابت في السجل (مقاوم لمترجم React) بدلاً من استدعاء ديناميكي أثناء الرندر.
- **SectorControlCard / ProjectControlCard**: بطاقات زجاجية حية تحمل الوصف والحالة والمعاينة وروابط التحرير ومفتاح التبديل (44×44)، ومرتّبة حسب `display_order` المعتمد في ترحيل Phase 3.
- **PreviewButton**: موجّه المعاينة الديناميكي — القطاع إلى `/${slug}` والمشروع عبر `APP_SLUG_ROUTES[slug]`؛ عند غياب مسار يُعطَّل الزر بأناقة.
- **IndicatorBadge**: شارة حالة زجاجية (نشط/متوقف/تحذير/خطر) بموجة توهج تنبض عند النشاط.

## القواعد المطلقة
1. لا بيانات وهمية — كل شبكة تستهلك API حقيقي.
2. كل عنصر تفاعلي ≥ 44×44 بكسل عبر `.touch-target` أو `min-h-[44px]`.
3. أي أيقونة مجهولة ترتد إلى `FolderKanban` ولا تُسقط الصفحة أبداً.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **DynamicProjectsGrid.tsx**: يرتبط بـ [  |  |  ]
- **DynamicSectorsGrid.tsx**: يرتبط بـ [  |  |  |  ]
- **IndicatorBadge.tsx**: يرتبط بـ [  ]
- **PreviewButton.tsx**: يرتبط بـ [  |  |  |  ]
- **ProjectControlCard.tsx**: يرتبط بـ [  |  |  |  |  |  ]
- **SectorControlCard.tsx**: يرتبط بـ [  |  |  |  |  |  |  |  ]
