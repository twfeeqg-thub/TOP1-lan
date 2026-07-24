export interface AuditLogEntry {
  id: number
  action: string
  actor: string
  actor_role: 'master' | 'system' | 'admin'
  target_type: 'project' | 'ad' | 'feature' | 'user' | 'setting'
  target_name: string
  timestamp: string
  severity: 'info' | 'success' | 'warning' | 'error'
  details?: string
}

export const auditLogMock: AuditLogEntry[] = [
  { id: 330, action: 'تمت الموافقة على إعلان مخبز الأصيل', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'مخبز الأصيل', timestamp: '2026-07-24T09:15:00Z', severity: 'success', details: 'باقة قياسي - شهر واحد' },
  { id: 329, action: 'تم تفعيل مشروع توأم المعلم', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'توأم المعلم', timestamp: '2026-07-24T08:45:00Z', severity: 'success' },
  { id: 328, action: 'تم رفض طلب إعلان عيادة الأمل', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'عيادة الأمل', timestamp: '2026-07-24T08:30:00Z', severity: 'warning', details: 'المرفقات غير مكتملة' },
  { id: 327, action: 'تم تحديث إعدادات النظام', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'إعدادات الأمان', timestamp: '2026-07-24T07:00:00Z', severity: 'info' },
  { id: 326, action: 'تم إضافة مستخدم جديد', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'user', target_name: 'سارة علي', timestamp: '2026-07-23T22:15:00Z', severity: 'info' },
  { id: 325, action: 'تم تفعيل ميزة الدفع الإلكتروني', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'الدفع الإلكتروني', timestamp: '2026-07-23T20:30:00Z', severity: 'success' },
  { id: 324, action: 'تم تعطيل إعلان تخفيضات رمضان', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'تخفيضات رمضان', timestamp: '2026-07-23T19:00:00Z', severity: 'warning', details: 'انتهت مدة الحملة' },
  { id: 323, action: 'تم تحديث المشروع التعليمي', actor: 'سارة علي', actor_role: 'admin', target_type: 'project', target_name: 'المنصة التعليمية', timestamp: '2026-07-23T16:45:00Z', severity: 'info' },
  { id: 322, action: 'تم رفع تقرير الأداء الشهري', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'التقارير', timestamp: '2026-07-23T14:00:00Z', severity: 'info', details: 'شهر يوليو 2026' },
  { id: 321, action: 'تم حظر مستخدم مخالف', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم 12345', timestamp: '2026-07-23T11:20:00Z', severity: 'error', details: 'نشاط مشبوه' },
  { id: 320, action: 'تم إضافة ميزة البحث الصوتي', actor: 'خالد عمر', actor_role: 'admin', target_type: 'feature', target_name: 'البحث الصوتي', timestamp: '2026-07-23T09:00:00Z', severity: 'success' },
  { id: 319, action: 'تم نشر إعلان المنصة التعليمية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'المنصة التعليمية', timestamp: '2026-07-22T18:30:00Z', severity: 'success', details: 'إعلان حصري - ظهور علوي' },
  { id: 318, action: 'تم تعديل صلاحيات مستخدم', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'نورة أحمد', timestamp: '2026-07-22T15:00:00Z', severity: 'warning' },
  { id: 317, action: 'تم تفعيل استضافة مشروع التجارة', actor: 'النظام', actor_role: 'system', target_type: 'project', target_name: 'منصة التجارة', timestamp: '2026-07-22T12:00:00Z', severity: 'success' },
  { id: 316, action: 'تم إيقاف ميزة مؤقتاً للصيانة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'الدردشة المباشرة', timestamp: '2026-07-22T10:15:00Z', severity: 'warning', details: 'صيانة مجدولة' },
  { id: 315, action: 'تم إنشاء مشروع جديد', actor: 'سارة علي', actor_role: 'admin', target_type: 'project', target_name: 'نظام الصحة الإلكتروني', timestamp: '2026-07-21T14:30:00Z', severity: 'info' },
  { id: 314, action: 'تم تسجيل دخول من جهاز جديد', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'جلسة دخول', timestamp: '2026-07-21T10:00:00Z', severity: 'warning', details: 'IP: 192.168.1.100' },
  { id: 313, action: 'تم تحديث كلمة المرور', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: 'كلمة المرور', timestamp: '2026-07-21T08:45:00Z', severity: 'info' },
  { id: 312, action: 'تم إضافة باقة إعلانية جديدة', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'الباقة المميزة', timestamp: '2026-07-20T16:00:00Z', severity: 'success' },
  { id: 311, action: 'تم أرشفة مشروع قديم', actor: 'النظام', actor_role: 'system', target_type: 'project', target_name: 'مشروع تجريبي 1', timestamp: '2026-07-20T13:00:00Z', severity: 'info', details: 'غير نشط منذ 6 أشهر' },
  { id: 310, action: 'تم رفض طلب تسجيل', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدم جديد', timestamp: '2026-07-20T11:30:00Z', severity: 'error', details: 'بيانات غير صالحة' },
  { id: 309, action: 'تم تفعيل ميزة الإشعارات الذكية', actor: 'خالد عمر', actor_role: 'admin', target_type: 'feature', target_name: 'الإشعارات الذكية', timestamp: '2026-07-20T09:00:00Z', severity: 'success' },
  { id: 308, action: 'تم تعديل الإعلان الرئيسي', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'الإعلان الرئيسي', timestamp: '2026-07-19T17:00:00Z', severity: 'info' },
  { id: 307, action: 'تم إنشاء تقرير مخصص', actor: 'سارة علي', actor_role: 'admin', target_type: 'setting', target_name: 'تقرير الأداء', timestamp: '2026-07-19T14:20:00Z', severity: 'info' },
  { id: 306, action: 'تم حذف مستخدم نهائياً', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم 67890', timestamp: '2026-07-19T12:00:00Z', severity: 'error', details: 'بناءً على طلب الحذف' },
  { id: 305, action: 'تم ترقية الباقة الإعلانية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'مكتبة المعرفة', timestamp: '2026-07-19T10:30:00Z', severity: 'success', details: 'من قياسي إلى حصري' },
  { id: 304, action: 'تم تفعيل النسخ الاحتياطي', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'النسخ الاحتياطي', timestamp: '2026-07-19T06:00:00Z', severity: 'info' },
  { id: 303, action: 'تم إيقاف المشروع مؤقتاً', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'تطبيق العقارات', timestamp: '2026-07-18T15:45:00Z', severity: 'warning', details: 'بسبب نقص الموارد' },
  { id: 302, action: 'تم إضافة تعليق على مشروع', actor: 'نورة أحمد', actor_role: 'admin', target_type: 'project', target_name: 'المنصة التعليمية', timestamp: '2026-07-18T13:00:00Z', severity: 'info' },
  { id: 301, action: 'تم تحديث سياسة الخصوصية', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'سياسة الخصوصية', timestamp: '2026-07-18T11:00:00Z', severity: 'info' },
  { id: 300, action: 'تم تفعيل الإعلان للعرض العام', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان الترحيب', timestamp: '2026-07-18T09:30:00Z', severity: 'success' },
  { id: 299, action: 'تم تسجيل خروج', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: 'جلسة مستخدم', timestamp: '2026-07-18T08:00:00Z', severity: 'info' },
  { id: 298, action: 'تم إعادة تشغيل الخادم', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'الخادم الرئيسي', timestamp: '2026-07-18T05:30:00Z', severity: 'warning', details: 'تحديث أمني' },
  { id: 297, action: 'تم إنشاء مستخدم جديد', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'خالد عمر', timestamp: '2026-07-17T16:00:00Z', severity: 'success' },
  { id: 296, action: 'تم رفض الإعلان لعدم المطابقة', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان غير مطابق', timestamp: '2026-07-17T14:15:00Z', severity: 'error', details: 'نص الإعلان مخالف للسياسة' },
  { id: 295, action: 'تم تفعيل ميزة متعددة المستأجرين', actor: 'خالد عمر', actor_role: 'admin', target_type: 'feature', target_name: 'Multi-Tenant', timestamp: '2026-07-17T12:00:00Z', severity: 'success' },
  { id: 294, action: 'تم تحديث حالة المشروع', actor: 'سارة علي', actor_role: 'admin', target_type: 'project', target_name: 'نظام الصحة الإلكتروني', timestamp: '2026-07-17T10:30:00Z', severity: 'info', details: '45% إنجاز' },
  { id: 293, action: 'تم إضافة صلاحية جديدة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'صلاحيات المسؤول', timestamp: '2026-07-17T09:00:00Z', severity: 'info' },
  { id: 292, action: 'تم تفعيل Kill Switch', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Kill Switch', timestamp: '2026-07-16T23:00:00Z', severity: 'error', details: 'إيقاف طارئ لجميع الإعلانات' },
  { id: 291, action: 'تم إلغاء تفعيل Kill Switch', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Kill Switch', timestamp: '2026-07-16T23:05:00Z', severity: 'success', details: 'عودة الإعلانات للعمل' },
  { id: 290, action: 'تم رفع الكارت الإعلاني', actor: 'مخبز الأصيل', actor_role: 'admin', target_type: 'ad', target_name: 'مخبز الأصيل', timestamp: '2026-07-16T20:00:00Z', severity: 'info' },
  { id: 289, action: 'تم تحديث الميزانية الإعلانية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'حملة العودة للمدارس', timestamp: '2026-07-16T18:00:00Z', severity: 'info', details: 'زيادة الميزانية إلى $3,200' },
  { id: 288, action: 'تم تفعيل التحقق الثنائي', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: '2FA', timestamp: '2026-07-16T15:00:00Z', severity: 'success' },
  { id: 287, action: 'تم إضافة قطاع النقل', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاع النقل', timestamp: '2026-07-16T12:30:00Z', severity: 'success' },
  { id: 286, action: 'تم حذف إعلان قديم', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'إعلان 2025', timestamp: '2026-07-16T10:00:00Z', severity: 'warning', details: 'أتمتة التنظيف' },
  { id: 285, action: 'تم تحديث شعار المنصة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'الشعار', timestamp: '2026-07-16T08:00:00Z', severity: 'info' },
  { id: 284, action: 'تم إطلاق الإصدار التجريبي', actor: 'النظام', actor_role: 'system', target_type: 'project', target_name: 'المنصة التعليمية', timestamp: '2026-07-15T22:00:00Z', severity: 'success', details: 'v2.0 Beta' },
  { id: 283, action: 'تم تصدير سجل التدقيق', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Audit Log', timestamp: '2026-07-15T18:30:00Z', severity: 'info' },
  { id: 282, action: 'تم تسجيل الدخول', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'جلسة دخول', timestamp: '2026-07-15T09:00:00Z', severity: 'info' },
  { id: 281, action: 'تم تعيين مسؤول جديد', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'نورة أحمد', timestamp: '2026-07-15T08:00:00Z', severity: 'success' },
  { id: 280, action: 'تم تفعيل ميزة التحليلات', actor: 'خالد عمر', actor_role: 'admin', target_type: 'feature', target_name: 'التحليلات', timestamp: '2026-07-14T16:00:00Z', severity: 'success' },
  { id: 279, action: 'تم تحديث حالة الإعلان إلى متوقف', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان تجريبي', timestamp: '2026-07-14T14:00:00Z', severity: 'warning' },
  { id: 278, action: 'تم إضافة باقة فيديو', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'الباقات', timestamp: '2026-07-14T12:00:00Z', severity: 'success' },
  { id: 277, action: 'تم إكمال اختبار المشروع', actor: 'سارة علي', actor_role: 'admin', target_type: 'project', target_name: 'تطبيق العقارات', timestamp: '2026-07-14T10:00:00Z', severity: 'success', details: 'اجتياز 92% من الاختبارات' },
  { id: 276, action: 'تم تفعيل وضع الصيانة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'وضع الصيانة', timestamp: '2026-07-14T08:00:00Z', severity: 'warning' },
  { id: 275, action: 'تم إلغاء وضع الصيانة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'وضع الصيانة', timestamp: '2026-07-14T08:30:00Z', severity: 'success' },
  { id: 274, action: 'تم رفض طلب ميزة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'طلب ميزة X', timestamp: '2026-07-13T15:00:00Z', severity: 'warning', details: ' خارج نطاق المنصة' },
  { id: 273, action: 'تم قبول طلب ميزة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'طلب ميزة Y', timestamp: '2026-07-13T14:00:00Z', severity: 'success' },
  { id: 272, action: 'تم إرسال إشعار جماعي', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'الإشعارات', timestamp: '2026-07-13T12:00:00Z', severity: 'info', details: 'لمستخدمين النظام' },
  { id: 271, action: 'تم إنشاء مشروع فرعي', actor: 'خالد عمر', actor_role: 'admin', target_type: 'project', target_name: 'مشروع فرعي 1', timestamp: '2026-07-13T10:00:00Z', severity: 'info' },
  { id: 270, action: 'تم تعديل صلاحية مشاهدة التقارير', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'صلاحية التقارير', timestamp: '2026-07-13T09:00:00Z', severity: 'info' },
  { id: 269, action: 'تم تفعيل الإعلان التلقائي', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'إعلان تلقائي', timestamp: '2026-07-12T20:00:00Z', severity: 'info' },
  { id: 268, action: 'تم تسجيل خطأ في النظام', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'سجل الأخطاء', timestamp: '2026-07-12T18:00:00Z', severity: 'error', details: '500 Internal Server Error - تم الحل' },
  { id: 267, action: 'تم تحديث خطة الأسعار', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'خطة الأسعار', timestamp: '2026-07-12T15:00:00Z', severity: 'info' },
  { id: 266, action: 'تم ترحيل قاعدة البيانات', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'قاعدة البيانات', timestamp: '2026-07-12T12:00:00Z', severity: 'success', details: 'ترحيل إلى Supabase' },
  { id: 265, action: 'تم إضافة مستخدم تجريبي', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم تجريبي', timestamp: '2026-07-12T10:00:00Z', severity: 'info' },
  { id: 264, action: 'تم تحديث سياسة الإعلانات', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'سياسة الإعلانات', timestamp: '2026-07-12T09:00:00Z', severity: 'info' },
  { id: 263, action: 'تم إيقاف الإعلانات المخالفة', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'إعلانات مخالفة', timestamp: '2026-07-11T22:00:00Z', severity: 'error', details: '3 إعلانات مخالفة للسياسة' },
  { id: 262, action: 'تم إضافة رد على استفسار', actor: 'نورة أحمد', actor_role: 'admin', target_type: 'project', target_name: 'منصة التجارة', timestamp: '2026-07-11T16:00:00Z', severity: 'info' },
  { id: 261, action: 'تم تحديث الميتا تاج', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'SEO', timestamp: '2026-07-11T14:00:00Z', severity: 'info' },
  { id: 260, action: 'تم تفعيل الإصدار التجريبي المغلق', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'نظام الصحة الإلكتروني', timestamp: '2026-07-11T12:00:00Z', severity: 'success' },
  { id: 259, action: 'تم تعديل الإعلان الحصري', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'الإعلان الحصري', timestamp: '2026-07-11T10:00:00Z', severity: 'info' },
  { id: 258, action: 'تم إضافة 5 مستخدمين جدد', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدمون جدد', timestamp: '2026-07-11T08:00:00Z', severity: 'success' },
  { id: 257, action: 'تم إنشاء مشروع تجاري', actor: 'خالد عمر', actor_role: 'admin', target_type: 'project', target_name: 'متجر إلكتروني', timestamp: '2026-07-10T16:00:00Z', severity: 'info' },
  { id: 256, action: 'تم تحميل الكارت الإعلاني', actor: 'مكتبة المعرفة', actor_role: 'admin', target_type: 'ad', target_name: 'مكتبة المعرفة', timestamp: '2026-07-10T14:00:00Z', severity: 'info' },
  { id: 255, action: 'تم تحديث إعدادات الإشعارات', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: 'الإشعارات', timestamp: '2026-07-10T12:00:00Z', severity: 'info' },
  { id: 254, action: 'تم تفعيل ميزة التقارير', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'التقارير المتقدمة', timestamp: '2026-07-10T10:00:00Z', severity: 'success' },
  { id: 253, action: 'تم حذف مشروع تجريبي', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'مشروع تجريبي 2', timestamp: '2026-07-10T09:00:00Z', severity: 'warning', details: 'انتهاء الفترة التجريبية' },
  { id: 252, action: 'تم تجديد الباقة الإعلانية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'عيادة النور', timestamp: '2026-07-09T17:00:00Z', severity: 'success' },
  { id: 251, action: 'تم إرسال إشعار ترحيبي', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدم جديد', timestamp: '2026-07-09T15:00:00Z', severity: 'info' },
  { id: 250, action: 'تم تحديث CSS الثيم', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Pink Theme', timestamp: '2026-07-09T14:00:00Z', severity: 'info' },
  { id: 249, action: 'تم تفعيل وضع الظلام', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: 'Dark Mode', timestamp: '2026-07-09T13:00:00Z', severity: 'info' },
  { id: 248, action: 'تم رفض طلب الانضمام', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم 54321', timestamp: '2026-07-09T11:00:00Z', severity: 'warning' },
  { id: 247, action: 'تم بدء الحملة الإعلانية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'حملة رمضان', timestamp: '2026-07-09T09:00:00Z', severity: 'success', details: 'مدة الحملة 30 يوماً' },
  { id: 246, action: 'تم إضافة فيديو تعريفي', actor: 'خالد عمر', actor_role: 'admin', target_type: 'project', target_name: 'المنصة التعليمية', timestamp: '2026-07-08T20:00:00Z', severity: 'info' },
  { id: 245, action: 'تم تحديث شروط الخدمة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'شروط الخدمة', timestamp: '2026-07-08T18:00:00Z', severity: 'info' },
  { id: 244, action: 'تم إيقاف حساب مخالف', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مخالف 001', timestamp: '2026-07-08T16:00:00Z', severity: 'error' },
  { id: 243, action: 'تم تفعيل الإعلان على الصفحة الرئيسية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان الرئيسية', timestamp: '2026-07-08T14:00:00Z', severity: 'success' },
  { id: 242, action: 'تم تحديث حالة الطلب إلى معتمد', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'طلب الإعلان', timestamp: '2026-07-08T12:00:00Z', severity: 'success' },
  { id: 241, action: 'تم إضافة أداة تحليل جديدة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'Google Analytics', timestamp: '2026-07-08T10:00:00Z', severity: 'info' },
  { id: 240, action: 'تم إنشاء مشروع السياحة', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاع السياحة', timestamp: '2026-07-08T09:00:00Z', severity: 'success' },
  { id: 239, action: 'تم ترقية الحساب', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدم مميز', timestamp: '2026-07-07T17:00:00Z', severity: 'success' },
  { id: 238, action: 'تم تفعيل Kill Switch تجربة', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'اختبار Kill Switch', timestamp: '2026-07-07T15:00:00Z', severity: 'warning' },
  { id: 237, action: 'تم إلغاء تفعيل Kill Switch تجربة', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'اختبار Kill Switch', timestamp: '2026-07-07T15:01:00Z', severity: 'success' },
  { id: 236, action: 'تم رفع تقرير Bugs', actor: 'سارة علي', actor_role: 'admin', target_type: 'project', target_name: 'Bugs Report', timestamp: '2026-07-07T14:00:00Z', severity: 'warning', details: '3 أخطاء حرجة تم حلها' },
  { id: 235, action: 'تم إضافة خاصية البحث', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'الباحث الذكي', timestamp: '2026-07-07T12:00:00Z', severity: 'success' },
  { id: 234, action: 'تم تحديث الإحصائيات يدوياً', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'الإحصائيات', timestamp: '2026-07-07T10:00:00Z', severity: 'info' },
  { id: 233, action: 'تم فتح طلب دعم', actor: 'نورة أحمد', actor_role: 'admin', target_type: 'project', target_name: 'طلب دعم تقني', timestamp: '2026-07-07T09:00:00Z', severity: 'info' },
  { id: 232, action: 'تم إغلاق طلب دعم', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'طلب دعم تقني', timestamp: '2026-07-07T09:30:00Z', severity: 'success' },
  { id: 231, action: 'تم إضافة مستخدم VIP', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم VIP', timestamp: '2026-07-06T18:00:00Z', severity: 'success' },
  { id: 230, action: 'تم تعطيل الإعلانات المؤقتة', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلانات مؤقتة', timestamp: '2026-07-06T16:00:00Z', severity: 'warning' },
  { id: 229, action: 'تم تفعيل وضع الاختبار', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Test Mode', timestamp: '2026-07-06T14:00:00Z', severity: 'info' },
  { id: 228, action: 'تم إلغاء وضع الاختبار', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Test Mode', timestamp: '2026-07-06T14:30:00Z', severity: 'info' },
  { id: 227, action: 'تم إكمال التحديث الأمني', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'التحديث الأمني', timestamp: '2026-07-06T12:00:00Z', severity: 'success' },
  { id: 226, action: 'تم إضافة باقة تجربة مجانية', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'باقة تجربة', timestamp: '2026-07-06T10:00:00Z', severity: 'info' },
  { id: 225, action: 'تم تفعيل SSL', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'SSL Certificate', timestamp: '2026-07-06T09:00:00Z', severity: 'success' },
  { id: 224, action: 'تم تحديث واجهة المستخدم', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Glass UI', timestamp: '2026-07-05T18:00:00Z', severity: 'info' },
  { id: 223, action: 'تم نشر التحديث الجديد', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'System Update', timestamp: '2026-07-05T16:00:00Z', severity: 'success', details: 'v2.1.0' },
  { id: 222, action: 'تمت أرشفة الإعلانات القديمة', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'أرشيف إعلانات', timestamp: '2026-07-05T14:00:00Z', severity: 'info' },
  { id: 221, action: 'تم إضافة قطاع الضيافة', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاع الضيافة', timestamp: '2026-07-05T12:00:00Z', severity: 'success' },
  { id: 220, action: 'تم تحديث الميزات المطلوبة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'طلبات الميزات', timestamp: '2026-07-05T10:00:00Z', severity: 'info' },
  { id: 219, action: 'تم الموافقة على طلب ميزة', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'طلب ميزة Z', timestamp: '2026-07-05T09:00:00Z', severity: 'success' },
  { id: 218, action: 'تم إعادة تعيين كلمة المرور', actor: 'أحمد محمد', actor_role: 'admin', target_type: 'setting', target_name: 'إعادة تعيين', timestamp: '2026-07-04T17:00:00Z', severity: 'warning' },
  { id: 217, action: 'تم إنشاء API Key', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'API Key', timestamp: '2026-07-04T15:00:00Z', severity: 'info' },
  { id: 216, action: 'تم إبطال API Key', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'API Key', timestamp: '2026-07-04T14:00:00Z', severity: 'warning' },
  { id: 215, action: 'تم تفعيل VPN', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'VPN Access', timestamp: '2026-07-04T12:00:00Z', severity: 'info' },
  { id: 214, action: 'تم إضافة مشروع النقل', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاع النقل', timestamp: '2026-07-04T10:00:00Z', severity: 'success' },
  { id: 213, action: 'تم تعديل الإعلان المثبت', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'الإعلان المثبت', timestamp: '2026-07-04T09:00:00Z', severity: 'info' },
  { id: 212, action: 'تم تفعيل عداد المشاهدات', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'عداد المشاهدات', timestamp: '2026-07-03T20:00:00Z', severity: 'info' },
  { id: 211, action: 'تم إضافة تتبع النقرات', actor: 'النظام', actor_role: 'system', target_type: 'ad', target_name: 'تتبع النقرات', timestamp: '2026-07-03T19:00:00Z', severity: 'info' },
  { id: 210, action: 'تم تحديث بيانات المستخدم', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم محدث', timestamp: '2026-07-03T17:00:00Z', severity: 'info' },
  { id: 209, action: 'تم إنشاء مشروع الزراعة', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاع الزراعة', timestamp: '2026-07-03T15:00:00Z', severity: 'success' },
  { id: 208, action: 'تم تفعيل الإعلان الفيديو', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان فيديو', timestamp: '2026-07-03T14:00:00Z', severity: 'success' },
  { id: 207, action: 'تم إيقاف الإعلان الفيديو', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان فيديو', timestamp: '2026-07-03T13:00:00Z', severity: 'warning', details: 'مراجعة المحتوى' },
  { id: 206, action: 'تم إضافة تعليق عام', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'إعلان عام', timestamp: '2026-07-03T12:00:00Z', severity: 'info' },
  { id: 205, action: 'تم تحديث سياسة الاستخدام', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'سياسة الاستخدام', timestamp: '2026-07-03T10:00:00Z', severity: 'info' },
  { id: 204, action: 'تمت الموافقة على التسجيل', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدم جديد 2', timestamp: '2026-07-03T09:00:00Z', severity: 'success' },
  { id: 203, action: 'تم تفعيل التحليل الفوري', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'Real-time Analytics', timestamp: '2026-07-02T18:00:00Z', severity: 'success' },
  { id: 202, action: 'تم تطهير ذاكرة التخزين', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'Cache', timestamp: '2026-07-02T16:00:00Z', severity: 'info' },
  { id: 201, action: 'تم إضافة 10 مستخدمين جدد', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'مستخدمون جدد', timestamp: '2026-07-02T14:00:00Z', severity: 'success' },
  { id: 200, action: 'تم تحديث لوحة القيادة', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'لوحة القيادة', timestamp: '2026-07-02T12:00:00Z', severity: 'info' },
  { id: 199, action: 'تم تفعيل البيانات الوهمية', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Mock Data Mode', timestamp: '2026-07-02T10:00:00Z', severity: 'warning', details: 'وضع التطوير' },
  { id: 198, action: 'تم إنشاء مشروع الصحة', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'نظام الصحة', timestamp: '2026-07-02T09:00:00Z', severity: 'success' },
  { id: 197, action: 'تم حذف مستخدم نهائياً', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم قديم', timestamp: '2026-07-01T18:00:00Z', severity: 'error' },
  { id: 196, action: 'تم تغيير صلاحية المستخدم', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم معدل', timestamp: '2026-07-01T16:00:00Z', severity: 'warning' },
  { id: 195, action: 'تم تحديث إعدادات الإعلانات', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعدادات الإعلانات', timestamp: '2026-07-01T14:00:00Z', severity: 'info' },
  { id: 194, action: 'تم تفعيل الإعلان الممول', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان ممول', timestamp: '2026-07-01T12:00:00Z', severity: 'success' },
  { id: 193, action: 'تم تعطيل الإعلان الممول', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان ممول', timestamp: '2026-07-01T11:00:00Z', severity: 'warning' },
  { id: 192, action: 'تم إضافة لغة إنجليزية', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'English Support', timestamp: '2026-07-01T10:00:00Z', severity: 'success' },
  { id: 191, action: 'تم تفعيل الترجمة التلقائية', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'Auto Translate', timestamp: '2026-07-01T09:00:00Z', severity: 'success' },
  { id: 190, action: 'تم إضافة مستخدم مميز', actor: 'المالك', actor_role: 'master', target_type: 'user', target_name: 'مستخدم مميز 2', timestamp: '2026-06-30T18:00:00Z', severity: 'info' },
  { id: 189, action: 'تم إنشاء إعلان جديد', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'إعلان جديد', timestamp: '2026-06-30T16:00:00Z', severity: 'success' },
  { id: 188, action: 'تم تعديل المشروع', actor: 'خالد عمر', actor_role: 'admin', target_type: 'project', target_name: 'مشروع معدل', timestamp: '2026-06-30T14:00:00Z', severity: 'info' },
  { id: 187, action: 'تم رفع ملف جديد', actor: 'نورة أحمد', actor_role: 'admin', target_type: 'project', target_name: 'ملفات المشروع', timestamp: '2026-06-30T12:00:00Z', severity: 'info' },
  { id: 186, action: 'تم تفعيل الـ CDN', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'CDN', timestamp: '2026-06-30T10:00:00Z', severity: 'success' },
  { id: 185, action: 'تم تحسين سرعة التحميل', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'Performance', timestamp: '2026-06-30T09:00:00Z', severity: 'success', details: 'تحسن بنسبة 40%' },
  { id: 184, action: 'تم تفعيل سجل التدقيق', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Audit Log', timestamp: '2026-06-29T18:00:00Z', severity: 'success' },
  { id: 183, action: 'تم إضافة 3 قطاعات جديدة', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'قطاعات جديدة', timestamp: '2026-06-29T16:00:00Z', severity: 'success' },
  { id: 182, action: 'تم تحديث الألوان', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Pink Theme Update', timestamp: '2026-06-29T15:00:00Z', severity: 'info' },
  { id: 181, action: 'تم تفعيل Glassmorphism', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'Glass UI', timestamp: '2026-06-29T14:00:00Z', severity: 'info' },
  { id: 180, action: 'تم نشر الإعلان الأول', actor: 'المالك', actor_role: 'master', target_type: 'ad', target_name: 'أول إعلان', timestamp: '2026-06-29T12:00:00Z', severity: 'success' },
  { id: 179, action: 'تم إنشاء أول مشروع', actor: 'المالك', actor_role: 'master', target_type: 'project', target_name: 'المشروع الأول', timestamp: '2026-06-29T10:00:00Z', severity: 'success' },
  { id: 178, action: 'تم تسجيل الدخول الأول', actor: 'المالك', actor_role: 'master', target_type: 'setting', target_name: 'أول جلسة', timestamp: '2026-06-29T09:00:00Z', severity: 'info', details: 'تم إنشاء لوحة الماستر' },
  { id: 177, action: 'تم تفعيل الميزات الأساسية', actor: 'المالك', actor_role: 'master', target_type: 'feature', target_name: 'Core Features', timestamp: '2026-06-29T08:00:00Z', severity: 'success' },
  { id: 176, action: 'تم بناء النظام الإعلاني', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'Ad System', timestamp: '2026-06-28T22:00:00Z', severity: 'success' },
  { id: 175, action: 'تم بناء لوحة الماستر', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'Master Panel', timestamp: '2026-06-28T20:00:00Z', severity: 'success' },
  { id: 174, action: 'تم تهيئة النظام', actor: 'النظام', actor_role: 'system', target_type: 'setting', target_name: 'System Init', timestamp: '2026-06-28T18:00:00Z', severity: 'info', details: 'إطلاق منصة ذكاء سهل' },
  { id: 123, action: 'تم إنشاء أول مستخدم', actor: 'النظام', actor_role: 'system', target_type: 'user', target_name: 'المالك', timestamp: '2026-06-28T12:00:00Z', severity: 'success' },
]

export function getSeverityIcon(severity: AuditLogEntry['severity']): string {
  switch (severity) {
    case 'success': return '●'
    case 'warning': return '●'
    case 'error': return '●'
    case 'info': return '●'
  }
}

export function getSeverityColor(severity: AuditLogEntry['severity']): string {
  switch (severity) {
    case 'success': return 'bg-emerald-500'
    case 'warning': return 'bg-amber-500'
    case 'error': return 'bg-rose-500'
    case 'info': return 'bg-sky-500'
  }
}

export function getSeverityGlow(severity: AuditLogEntry['severity']): string {
  switch (severity) {
    case 'success': return 'shadow-[0_0_12px_rgba(34,197,94,0.5)]'
    case 'warning': return 'shadow-[0_0_12px_rgba(245,158,11,0.5)]'
    case 'error': return 'shadow-[0_0_12px_rgba(244,63,94,0.5)]'
    case 'info': return 'shadow-[0_0_12px_rgba(14,165,233,0.5)]'
  }
}

export function getTargetTypeLabel(type: AuditLogEntry['target_type']): string {
  switch (type) {
    case 'project': return 'مشروع'
    case 'ad': return 'إعلان'
    case 'feature': return 'ميزة'
    case 'user': return 'مستخدم'
    case 'setting': return 'إعدادات'
  }
}

export function getTargetTypeColor(type: AuditLogEntry['target_type']): string {
  switch (type) {
    case 'project': return 'text-violet-400 bg-violet-500/10'
    case 'ad': return 'text-pink-400 bg-pink-500/10'
    case 'feature': return 'text-cyan-400 bg-cyan-500/10'
    case 'user': return 'text-emerald-400 bg-emerald-500/10'
    case 'setting': return 'text-amber-400 bg-amber-500/10'
  }
}