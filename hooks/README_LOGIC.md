### المنطق البشري (HUMAN_LOGIC)
- **use-projects.ts**: جلب المشاريع والإعلانات عبر React Query مع كاش IndexedDB (Dexie). أي استعلام ناجح يُرجع `data ?? []` دائماً — لا ابتلاع وهمي. الفشل يُطبع بـ `console.error` ثم يقرأ الكاش؛ `fallbackProjects`/`AD_FALLBACK` لا يُستخدمان إلا عند انقطاع تام (`!navigator.onLine`) وخلوّ الكاش.
- **use-master-realtime.ts** (Phase 3): خطاف المزامنة اللحظية للوحة الماستر. يشترك في قنوات Supabase Realtime لبث تغيّرات Postgres على جداول سكيما `core` (`sectors`, `project_definitions`, `master_audit_log`, `ads_engine` + `ad_requests`, `features`, `kill_switch`) ويربط كل جدول بكيانات React Query (`master-sectors`, `master-projects`, `master-audit`, `master-ads`, ...). أي حدث INSERT/UPDATE/DELETE يُبطل الكاش فوراً — إلغاء الحاجة لأزرار التحديث اليدوية. عند غياب التهيئة أو تعذّر القناة يتحلل بصمت مع تحذير ولا يكسر اللوحة.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **use-client-workspace.ts**: يرتبط بـ [  |  |  |  ]
- **use-local-storage.ts**: يرتبط بـ [  ]
- **use-master-realtime.ts**: يرتبط بـ [  |  |  ]
- **use-mobile.ts**: يرتبط بـ [  ]
- **use-offline.ts**: يرتبط بـ [  ]
- **use-outbox.ts**: يرتبط بـ [  |  ]
- **use-projects.ts**: يرتبط بـ [  |  |  ]
- **use-psych-message.ts**: يرتبط بـ [  ]
