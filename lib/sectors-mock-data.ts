import type { SectorSummary, SectorData } from './sector-types'

export const sectorsMock: SectorSummary[] = [
  { id: 'edu-1', name: 'التعليم', slug: 'education', icon: 'GraduationCap', is_active: true, created_at: '2026-01-15T00:00:00Z' },
  { id: 'health-1', name: 'الصحة', slug: 'health', icon: 'HeartPulse', is_active: true, created_at: '2026-02-10T00:00:00Z' },
  { id: 'realestate-1', name: 'العقارات', slug: 'realestate', icon: 'Building2', is_active: true, created_at: '2025-11-20T00:00:00Z' },
  { id: 'commerce-1', name: 'التجارة', slug: 'commerce', icon: 'ShoppingCart', is_active: false, created_at: '2026-07-01T00:00:00Z' },
]

export const sectorFullData: Record<string, SectorData> = {
  'edu-1': {
    hero: {
      badge: 'المنصة التعليمية الرائدة',
      title: 'نحو تعليم رقمي متكامل',
      description: 'منصة ذكاء سهل التعليمية تقدم حلولاً رقمية شاملة للمدارس والجامعات، تجمع بين الذكاء الاصطناعي وتقنيات التعلّم الحديثة لتمكين الطلاب والمعلمين.',
      cta_primary: { text: 'ابدأ الآن مجاناً', href: '/register?service=education' },
      cta_secondary: { text: 'تعرف على المزيد', href: '/education/about' },
      cover_image: '/assets/education-hero.jpg',
    },
    projects: [
      {
        id: 'proj-1',
        name: 'الفصول الذكية',
        description: 'بيئة تفاعلية للفصول الافتراضية مع بث مباشر، سبورة ذكية، وتقييم فوري.',
        icon: 'Monitor',
        features: ['بث مباشر بتقنية HD', 'سبورة تفاعلية', 'تقييم فوري', 'مكتبة رقمية'],
        register_link: '/register?service=smart-class',
        login_link: '/login?service=smart-class',
      },
      {
        id: 'proj-2',
        name: 'نظام إدارة المدارس',
        description: 'إدارة شاملة للطلاب، الجداول، الدرجات، والتقارير في واجهة واحدة.',
        icon: 'Building',
        features: ['سجل طلابي', 'جداول ذكية', 'تقارير الأداء', 'تواصل أولياء الأمور'],
        register_link: '/register?service=sms',
        login_link: '/login?service=sms',
      },
    ],
    about: {
      title: 'من نحن في قطاع التعليم',
      description: 'نحن فريق من الخبراء التربويين والتقنيين نعمل على تحويل التعليم التقليدي إلى تجربة رقمية متفاعلة. نؤمن بأن التكنولوجيا يجب أن تكون في خدمة المعلم والطالب، لا العكس.',
      highlights: [
        { text: 'أكثر من 500 مدرسة مسجلة', icon: 'School' },
        { text: 'أكثر من 50 ألف طالب مستفيد', icon: 'Users' },
        { text: 'نسبة رضا تتجاوز 95%', icon: 'Heart' },
        { text: 'فريق دعم فني على مدار الساعة', icon: 'Headphones' },
      ],
    },
    testimonials: [
      {
        id: 'test-1',
        name: 'أ. محمد العلي',
        role: 'مدير مدرسة، مجمع الملك سلمان التعليمي',
        content: 'منصة ذكاء سهل غيرت طريقة تدريسنا بالكامل. أصبحنا قادرين على متابعة كل طالب بشكل فردي.',
        avatar: '/assets/avatars/avatar-1.jpg',
      },
      {
        id: 'test-2',
        name: 'نورة الأحمد',
        role: 'معلمة، ثانوية الفارابي',
        content: 'الأدوات التفاعلية سهلت عليّ شرح المفاهيم الصعبة. الطلاب أصبحوا أكثر حماساً للتعلم.',
        avatar: '/assets/avatars/avatar-2.jpg',
      },
    ],
    faqs: [
      {
        id: 'faq-1',
        question: 'كيف يمكنني تسجيل مدرستي في المنصة؟',
        answer: 'يمكنك التسجيل عبر الضغط على زر "ابدأ الآن مجاناً" وملء البيانات المطلوبة. سيقوم فريقنا بالتواصل معك خلال 24 ساعة لتأكيد الاشتراك.',
      },
      {
        id: 'faq-2',
        question: 'هل تدعم المنصة المنهج السعودي؟',
        answer: 'نعم، المنصة مصممة خصيصاً لدعم المنهج السعودي والعربي، مع تحديث مستمر للمحتوى.',
      },
      {
        id: 'faq-3',
        question: 'ما هي متطلبات التشغيل؟',
        answer: 'يكفي وجود اتصال إنترنت ومتصفح حديث. المنصة تعمل على جميع الأجهزة بما فيها الهواتف الذكية.',
      },
    ],
    partners: [
      { id: 'part-1', name: 'وزارة التعليم', logo: '/assets/partners/moe-logo.png' },
      { id: 'part-2', name: 'شركة الاتصالات', logo: '/assets/partners/telecom-logo.png' },
      { id: 'part-3', name: 'مؤسسة تكوين', logo: '/assets/partners/takwin-logo.png' },
    ],
    legal_footer: {
      compliance_text: 'هذه المنصة متوافقة مع معايير هيئة الاتصالات وتقنية المعلومات وحماية البيانات الشخصية.',
      meta_rights_text: '© 2026 ذكاء سهل - جميع الحقوق محفوظة. هذا المنتج مستقل وغير تابع لشركة Meta Platforms Inc.',
      contact_email: 'education@zakasahl.com',
      contact_phone: '+966 55 123 4567',
      contact_address: 'الرياض، المملكة العربية السعودية، حي العليا، برج الأعمال',
      policy_links: [
        { label: 'سياسة الخصوصية', href: '/privacy' },
        { label: 'شروط الاستخدام', href: '/terms' },
        { label: 'سياسة ملفات تعريف الارتباط', href: '/cookies' },
      ],
    },
  },

  'health-1': {
    hero: {
      badge: 'نظام الصحة الإلكتروني',
      title: 'صحتك في يدك',
      description: 'منصة متكاملة لإدارة الخدمات الصحية، حجوزات العيادات، الملفات الطبية الإلكترونية، والتواصل مع الكوادر الطبية.',
      cta_primary: { text: 'احجز موعدك الآن', href: '/register?service=health' },
      cta_secondary: { text: 'استكشف الخدمات', href: '/health/services' },
      cover_image: '/assets/health-hero.jpg',
    },
    projects: [
      {
        id: 'proj-h1',
        name: 'الملف الطبي الموحد',
        description: 'سجل صحي إلكتروني موحد يتابع تاريخ المريض عبر جميع المنشآت الطبية.',
        icon: 'FileText',
        features: ['سجل طبي شامل', 'مشاركة آمنة', 'تذكير بالأدوية', 'نتائج فحوصات'],
        register_link: '/register?service=health-record',
        login_link: '/login?service=health-record',
      },
      {
        id: 'proj-h2',
        name: 'حجوزات العيادات',
        description: 'نظام حجوزات ذكي يدعم المواعيد عن بعد والاستشارات الفيديو.',
        icon: 'Calendar',
        features: ['حجز إلكتروني', 'استشارات فيديو', 'تذكير بالمواعيد', 'إلغاء وإعادة جدولة'],
        register_link: '/register?service=health-book',
        login_link: '/login?service=health-book',
      },
    ],
    about: {
      title: 'من نحن في قطاع الصحة',
      description: 'فريق طبي وتقني يعمل على رقمنة القطاع الصحي وجعل الخدمات الطبية أكثر سهولة ووصولاً للجميع، مع أعلى معايير الخصوصية والأمان.',
      highlights: [
        { text: 'أكثر من 200 منشأة صحية', icon: 'Hospital' },
        { text: 'أكثر من 100 ألف مستفيد', icon: 'Users' },
        { text: 'نسبة رضا 98%', icon: 'Heart' },
        { text: 'شهادة أمان معلومات ISO 27001', icon: 'Shield' },
      ],
    },
    testimonials: [
      {
        id: 'test-h1',
        name: 'د. سارة القحطاني',
        role: 'استشارية، مستشفى الملك فيصل',
        content: 'الملف الطبي الموحد وفر علينا الكثير من الوقت. الآن نرى التاريخ الكامل للمريض بنقرة زر.',
        avatar: '/assets/avatars/avatar-3.jpg',
      },
    ],
    faqs: [
      {
        id: 'faq-h1',
        question: 'كيف أحجز موعداً؟',
        answer: 'يمكنك حجز موعد عبر اختيار العيادة والطبيب المناسب، ثم تحديد الوقت المتاح. ستصل لك رسالة تأكيد فورية.',
      },
      {
        id: 'faq-h2',
        question: 'هل بياناتي الطبية محمية؟',
        answer: 'نعم، نستخدم أعلى معايير التشفير وحماية البيانات، ونلتزم بلوائح حماية البيانات الصحية.',
      },
    ],
    partners: [
      { id: 'part-h1', name: 'وزارة الصحة', logo: '/assets/partners/moh-logo.png' },
      { id: 'part-h2', name: 'الهيئة السعودية للتخصصات الصحية', logo: '/assets/partners/scfhs-logo.png' },
    ],
    legal_footer: {
      compliance_text: 'المنصة متوافقة مع معايير وزارة الصحة السعودية وهيئة البيانات والذكاء الاصطناعي.',
      meta_rights_text: '© 2026 ذكاء سهل - جميع الحقوق محفوظة.',
      contact_email: 'health@zakasahl.com',
      contact_phone: '+966 55 234 5678',
      contact_address: 'جدة، المملكة العربية السعودية، حي الشاطئ',
      policy_links: [
        { label: 'سياسة الخصوصية الصحية', href: '/privacy' },
        { label: 'شروط الاستخدام', href: '/terms' },
        { label: 'سياسة أمن المعلومات', href: '/security' },
      ],
    },
  },

  'realestate-1': {
    hero: {
      badge: 'تطبيق العقارات الذكي',
      title: 'عقارك بنقرة زر',
      description: 'منصة عقارية متكاملة تتيح البحث والتملك والتأجير وإدارة الممتلكات عبر تقنيات الواقع الافتراضي والذكاء الاصطناعي.',
      cta_primary: { text: 'ابحث عن عقار', href: '/register?service=realestate' },
      cta_secondary: { text: 'أضف عقارك', href: '/realestate/add' },
      cover_image: '/assets/realestate-hero.jpg',
    },
    projects: [
      {
        id: 'proj-r1',
        name: 'جولات الواقع الافتراضي',
        description: 'تجول في العقارات عن بعد بتقنية 360 درجة قبل الزيارة الفعلية.',
        icon: 'Glasses',
        features: ['جولة 360', 'قياس المسافات', 'مشاركة الجولة', 'حجز معاينة'],
        register_link: '/register?service=vr-tour',
        login_link: '/login?service=vr-tour',
      },
    ],
    about: {
      title: 'من نحن في قطاع العقارات',
      description: 'نجمع بين التكنولوجيا والعقار لنقدم تجربة فريدة في البحث والتملك. فريقنا من خبراء العقار والتقنية يعملون لتبسيط كل خطوة.',
      highlights: [
        { text: 'أكثر من 10 آلاف عقار', icon: 'Building2' },
        { text: 'شراكة مع 500 مكتب عقاري', icon: 'Handshake' },
        { text: 'تقييم 4.8 في المتجر', icon: 'Star' },
      ],
    },
    testimonials: [
      {
        id: 'test-r1',
        name: 'فهد المطيري',
        role: 'وسيط عقاري',
        content: 'الجولات الافتراضية وفرت عليا وقت طويل. العملاء يشوفون العقار قبل المجيء.',
        avatar: '/assets/avatars/avatar-4.jpg',
      },
    ],
    faqs: [
      {
        id: 'faq-r1',
        question: 'كيف أضيف عقاراً للإيجار؟',
        answer: 'سجّل دخولك، اضغط "أضف عقارك"، املأ التفاصيل والصور، وسيتم النشر بعد المراجعة.',
      },
    ],
    partners: [
      { id: 'part-r1', name: 'الهيئة العامة للعقار', logo: '/assets/partners/rega-logo.png' },
      { id: 'part-r2', name: 'منصة إيجار', logo: '/assets/partners/ejar-logo.png' },
    ],
    legal_footer: {
      compliance_text: 'المنصة مرخصة من الهيئة العامة للعقار وتلتزم بجميع الأنظمة والتشريعات العقارية.',
      meta_rights_text: '© 2026 ذكاء سهل - جميع الحقوق محفوظة.',
      contact_email: 'realestate@zakasahl.com',
      contact_phone: '+966 55 345 6789',
      contact_address: 'الخبر، المملكة العربية السعودية',
      policy_links: [
        { label: 'سياسة الخصوصية', href: '/privacy' },
        { label: 'شروط الوساطة العقارية', href: '/terms' },
      ],
    },
  },

  'commerce-1': {
    hero: {
      badge: 'منصة التجارة الإلكترونية',
      title: 'تسوق بذكاء',
      description: 'منصة تجارة إلكترونية متكاملة تمكن التاجر من إنشاء متجره الإلكتروني وإدارة المبيعات والمخزون بسهولة.',
      cta_primary: { text: 'أنشئ متجرك', href: '/register?service=commerce' },
      cta_secondary: { text: 'تسوق الآن', href: '/commerce' },
      cover_image: '/assets/commerce-hero.jpg',
    },
    projects: [
      {
        id: 'proj-c1',
        name: 'متجر ذكي',
        description: 'أنشئ متجرك الإلكتروني في دقائق مع قوالب جاهزة ونظام دفع متكامل.',
        icon: 'Store',
        features: ['قوالب احترافية', 'بوابة دفع', 'إدارة مخزون', 'تقارير مبيعات'],
        register_link: '/register?service=smart-store',
        login_link: '/login?service=smart-store',
      },
    ],
    about: {
      title: 'من نحن في قطاع التجارة',
      description: 'نمكن التجار من بناء متاجرهم الإلكترونية بسهولة ونساعدهم على النمو في العالم الرقمي.',
      highlights: [
        { text: 'أكثر من 1000 تاجر', icon: 'Users' },
        { text: 'معدل نمو 150% سنوياً', icon: 'TrendingUp' },
        { text: 'دعم فني 24/7', icon: 'Headphones' },
      ],
    },
    testimonials: [],
    faqs: [
      {
        id: 'faq-c1',
        question: 'ما هي رسوم المنصة؟',
        answer: 'نقدم باقة مجانية للبدء، والباقات المدفوعة تبدأ من 99 ريال شهرياً.',
      },
    ],
    partners: [
      { id: 'part-c1', name: 'بنك الرياض', logo: '/assets/partners/riyad-bank-logo.png' },
      { id: 'part-c2', name: 'سلة', logo: '/assets/partners/salla-logo.png' },
    ],
    legal_footer: {
      compliance_text: 'المنصة متوافقة مع أنظمة التجارة الإلكترونية وحماية المستهلك في المملكة.',
      meta_rights_text: '© 2026 ذكاء سهل - جميع الحقوق محفوظة.',
      contact_email: 'commerce@zakasahl.com',
      contact_phone: '+966 55 456 7890',
      contact_address: 'الرياض، المملكة العربية السعودية',
      policy_links: [
        { label: 'سياسة الخصوصية', href: '/privacy' },
        { label: 'سياسة الاسترجاع', href: '/returns' },
        { label: 'شروط البائعين', href: '/seller-terms' },
      ],
    },
  },
}
