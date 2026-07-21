-- ============================================================
-- Seed: 5 Education Projects — Easy Intelligence Platform
-- Adjusted for the Sovereign Architecture (JSONB Injection)
-- ============================================================
INSERT INTO core.project_definitions (project_slug, sector_name, is_active, modules_config)
VALUES
(
'exam-engine',
'سهل - ذكاء رقمي تعليمي',
true,
'{
"name_ar": "محرك الاختبارات",
"name_en": "Exam Engine",
"description_ar": "إنشاء، تصحيح، وتحليل الاختبارات المدرسية بشكل آلي ذكي ومريح يوفر وقتك وجهدك ويقلل الأخطاء.",
"description_en": "Create, grade, and analyze school exams automatically and intelligently, saving your time and reducing errors.",
"icon": "📝",
"type": "education",
"registerUrl": "/register?service=exam-engine",
"loginUrl": "/login?service=exam-engine",
"encouragementAr": "اجعل تقييم طلابك متعة خالية من الإجهاد، نحن معك لنضمن لك دقة كاملة وراحة تامة. 💚",
"encouragementEn": "Make grading a stress-free joy, we are with you to ensure absolute accuracy and complete comfort. 💚",
"summaryAr": "منصة اختبارات ذكية تدعم أنواع الأسئلة المختلفة والتصحيح الآلي.",
"summaryEn": "Smart exam platform supporting various question types and automated grading.",
"features": [
{"ar": "إنشاء اختبارات احترافية في دقائق", "en": "Create professional exams in minutes"},
{"ar": "تصحيح آلي فوري لجميع أنواع الأسئلة", "en": "Instant auto-grading for all question types"},
{"ar": "تحليل أداء الطلاب وتقارير ذكية", "en": "Student performance analysis and smart reports"},
{"ar": "بنك أسئلة متكامل قابل للتوسع", "en": "Comprehensive expandable question bank"},
{"ar": "دعم أنواع متعددة من الأسئلة", "en": "Support for multiple question types"}
],
"order": 1
}'::jsonb
),
(
'teacher-twin',
'سهل - ذكاء رقمي تعليمي',
true,
'{
"name_ar": "توأم المعلم",
"name_en": "Teacher Twin",
"description_ar": "مساعدك الرقمي الذكي لتحضير الدروس، صياغة الأنشطة المبتكرة، وتوفير إجابات فورية نموذجية لطلابك.",
"description_en": "Your smart digital assistant for lesson planning, crafting innovative activities, and providing instant feedback for students.",
"icon": "🤖",
"type": "education",
"registerUrl": "/register?service=teacher-twin",
"loginUrl": "/login?service=teacher-twin",
"encouragementAr": "لست وحدك في رحلة التعليم الرائعة، توأمك الرقمي هنا لرفع طاقتك الإبداعية وتقليل أعبائك اليومية. ✨",
"encouragementEn": "You are not alone in this wonderful educational journey; your digital twin is here to boost creativity and ease daily loads. ✨",
"summaryAr": "مساعد ذكي للمعلمين يوفر خطط دراسية ومواد تعليمية مخصصة.",
"summaryEn": "Smart assistant for teachers providing customized lesson plans and educational materials.",
"features": [
{"ar": "تحضير دروس ذكي باستخدام الذكاء الاصطناعي", "en": "AI-powered smart lesson planning"},
{"ar": "صياغة أنشطة مبتكرة وتفاعلية", "en": "Create innovative and interactive activities"},
{"ar": "إجابات فورية نموذجية للطلاب", "en": "Instant model answers for students"},
{"ar": "تقليل الأعباء اليومية للمعلم", "en": "Reduce daily workload for teachers"},
{"ar": "مكتبة محتوى تعليمي ذكية", "en": "Smart educational content library"}
],
"order": 2
}'::jsonb
),
(
'school-management',
'سهل - ذكاء رقمي تعليمي',
true,
'{
"name_ar": "إدارة المدارس",
"name_en": "School Management",
"description_ar": "منظومة شاملة تربط الإدارة بالمعلمين والطلاب وأولياء الأمور لتجربة تعليمية متكاملة تضمن التواصل المستمر.",
"description_en": "A comprehensive school system connecting administration, teachers, students, and parents for an integrated, smooth experience.",
"icon": "🏫",
"type": "administration",
"registerUrl": "/register?service=school-management",
"loginUrl": "/login?service=school-management",
"encouragementAr": "بناء أجيال المستقبل يحتاج تكاتفاً يسيراً، منصتنا تجمع شتات المهام لتتفرغ للأثر الحقيقي. 🤝",
"encouragementEn": "Building future generations requires seamless collaboration; our platform unifies tasks so you can focus on true impact. 🤝",
"summaryAr": "نظام متكامل لإدارة الطلاب، الموظفين، الجداول، والتقارير.",
"summaryEn": "Integrated system for managing students, staff, schedules, and reports.",
"features": [
{"ar": "ربط الإدارة بالمعلمين والطلاب وأولياء الأمور", "en": "Connect admin, teachers, students, and parents"},
{"ar": "إدارة الجداول الدراسية والحصص", "en": "Manage schedules and classes"},
{"ar": "تقارير أداء شاملة وآنية", "en": "Comprehensive real-time performance reports"},
{"ar": "التواصل المستمر مع أولياء الأمور", "en": "Continuous communication with parents"},
{"ar": "نظام متكامل للغياب والحضور", "en": "Integrated attendance system"}
],
"order": 3
}'::jsonb
),
(
'institute-management',
'سهل - ذكاء رقمي تعليمي',
true,
'{
"name_ar": "إدارة المعاهد",
"name_en": "Institute Management",
"description_ar": "تنظيم الجداول، الحضور والغياب، المدفوعات والشهادات لمعاهد التدريب والمراكز التعليمية بكل سلاسة ووضوح.",
"description_en": "Organize schedules, attendance, payments, and certificates for training institutes and educational centers with absolute ease.",
"icon": "🏛️",
"type": "administration",
"registerUrl": "/register?service=institute-management",
"loginUrl": "/login?service=institute-management",
"encouragementAr": "نحن نؤمن برؤيتك لتطوير المهارات، ونسعى لتوفير بيئة إدارية مريحة تحفز شغف طلابك للتعلم. 🚀",
"encouragementEn": "We believe in your vision to develop skills, and strive to provide a comfortable administrative environment that inspires students. 🚀",
"summaryAr": "حلول إدارية متكاملة للمعاهد ومراكز التدريب.",
"summaryEn": "Integrated administrative solutions for institutes and training centers.",
"features": [
{"ar": "تنظيم الجداول والمواعيد بسلاسة", "en": "Smooth schedule and appointment management"},
{"ar": "نظام حضور وغياب متكامل", "en": "Complete attendance tracking system"},
{"ar": "إدارة المدفوعات والفواتير", "en": "Payments and invoices management"},
{"ar": "إصدار الشهادات والتقارير", "en": "Certificates and reports generation"},
{"ar": "لوحة تحكم شاملة لإدارة المعهد", "en": "Comprehensive institute dashboard"}
],
"order": 4
}'::jsonb
),
(
'quran-circles',
'سهل - ذكاء رقمي تعليمي',
true,
'{
"name_ar": "حلقات تحفيظ القرآن الكريم",
"name_en": "Quran Memorization Circles",
"description_ar": "متابعة وتتبع الحفظ والتجويد والمراجعة لطلاب الحلقات، مع تقارير أداء دورية تبهج قلوب أولياء الأمور.",
"description_en": "Track memorization, Tajweed, and revision for Quran circle students, with periodic reports that delight parents.",
"icon": "📖",
"type": "education",
"registerUrl": "/register?service=quran-circles",
"loginUrl": "/login?service=quran-circles",
"encouragementAr": "خدمة كتاب الله شرف عظيم، ونسعى بكل حب لتيسير هذا الفضل وتتويج مساعي الحفظة بالبهجة والسهولة. 🌟",
"encouragementEn": "Serving the Book of Allah is an honor; we aim with love to facilitate this virtue and crown students'' efforts with joy. 🌟",
"summaryAr": "نظام متخصص لإدارة حلقات التحفيظ، متابعة الطلاب، وتقييم الحفظ.",
"summaryEn": "Specialized system for managing memorization circles, student tracking, and progress evaluation.",
"features": [
{"ar": "متابعة الحفظ والتجويد والمراجعة", "en": "Track memorization, Tajweed, and revision"},
{"ar": "تقارير أداء دورية لأولياء الأمور", "en": "Periodic performance reports for parents"},
{"ar": "تقييم دقيق لمستوى الطلاب", "en": "Accurate student level assessment"},
{"ar": "إدارة حلقات التحفيظ بكفاءة", "en": "Efficient circle management"},
{"ar": "إشعارات ذكية للتذكير بالمراجعة", "en": "Smart notifications for revision reminders"}
],
"order": 5
}'::jsonb
)
ON CONFLICT (project_slug) DO UPDATE SET
sector_name = EXCLUDED.sector_name,
is_active = EXCLUDED.is_active,
modules_config = EXCLUDED.modules_config;
