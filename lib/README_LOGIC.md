### المنطق البشري (HUMAN_LOGIC)
- **supabase-pool.ts**: قلب الربط الخلفي. يكشف `pool` (pg.Pool على `DATABASE_URL` منفذ 6543، `ssl: { rejectUnauthorized: false }`، `max: 10`) ودالة `logAudit()` التي تكتب في `core.master_audit_log`. يُبقي `poolAdmin` (REST عبر Service Role) كما هو. إذا غاب `DATABASE_URL` يكون `pool === null` وتُتخطى الكتابة مع تحذير — لا رمي.
- **get-sector-data.ts**: يقرأ `full_data` (JSONB) من `core.sectors` بالـ `slug`. يفصل بين خطأ القاعدة الحقيقي (PostgREST: يُطبع ويُرمى — لا ارتداد وهمي) والفشل الشبكي التام (fetch رمى: يُطبع ويُرتد للموك فقط). عند غياب القطاع يُرجع `{ data: null, isFallback: false }` ليُفعَّل `notFound()`.
- **sectors-mock-data.ts / ads-mock-data.ts / audit-log-mock-data.ts / supabase.ts (fallbackProjects)**: موك معطّل بلا حذف — لا يُستورد في المسارات أو العرض.

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **ad-types.ts**: يرتبط بـ [ لا يوجد ارتباطات خارجية ]
- **ads-mock-data.ts**: يرتبط بـ [  ]
- **audit-log-mock-data.ts**: يرتبط بـ [ لا يوجد ارتباطات خارجية ]
- **auth.ts**: يرتبط بـ [  |  ]
- **db.ts**: يرتبط بـ [  ]
- **exam-db.ts**: يرتبط بـ [  ]
- **get-sector-data.ts**: يرتبط بـ [  |  ]
- **phone.ts**: يرتبط بـ [  ]
- **psych-support.ts**: يرتبط بـ [  ]
- **sector-types.ts**: يرتبط بـ [ لا يوجد ارتباطات خارجية ]
- **sectors-mock-data.ts**: يرتبط بـ [  ]
- **supabase-pool.ts**: يرتبط بـ [  |  ]
- **supabase.ts**: يرتبط بـ [  ]
- **utils.ts**: يرتبط بـ [  |  ]
- **validators.ts**: يرتبط بـ [  ]
