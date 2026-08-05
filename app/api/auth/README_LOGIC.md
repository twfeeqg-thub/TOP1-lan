# README_LOGIC.md — app/api/auth (المصادقة السيادية)

## المنطق البشري (Human Logic)

المصادقة في منصة ذكاء سهل يجب أن تكون:
- **سيادية بالكامل**: لا نعتمد على أي طرف ثالث للمصادقة. نحن نتحكم في دورة حياة الجلسة بالكامل.
- **REST API فقط**: لا استخدام لـ WebSockets في المصادقة. كل شيء عبر طلبات HTTP تقليدية.
- **رقم الهاتف هو المعرف الأساسي (Primary Identifier)**: لا بريد إلكتروني، لا اسم مستخدم. رقم الهاتف هو المفتاح.
- **حماية الجلسة بـ HttpOnly Cookie**: الـ Refresh Token يُخزَّن فقط في Cookie من نوع HttpOnly مع SameSite=Strict لحمايته من هجمات XSS.
- **اتصال قاعدة البيانات عبر REST API (Service Role)**: تُستخدم `poolAdmin` من `lib/supabase-pool` (supabase-js على منفذ 443 مع Service Role و schema `core`) — وليس pg Pooler. الـ Pooler (pg على منفذ 6543) مخصص للعمليات الثقيلة والتدقيق في لوحة الماستر فقط.
- **دعم Push Tokens**: كل مستخدم يمكنه ربط push_tokens لحسابه للإشعارات الفورية.

## الهيكل الآلي (Auto-Structure)

```
app/api/auth/
├── register/route.ts    ← إنشاء حساب (هاتف + كلمة مرور + اسم)
├── login/route.ts       ← تسجيل الدخول (هاتف + كلمة مرور)
├── logout/route.ts      ← إنهاء الجلسة (إبطال refresh_token)
├── refresh/route.ts     ← تجديد access_token عبر refresh_token
├── check-phone/route.ts ← التحقق من توفر رقم الهاتف
└── push-token/route.ts  ← ربط push_token للحساب
```

## القواعد المطلقة
1. لا WebSockets في المصادقة — REST فقط.
2. رقم الهاتف هو المعرف الوحيد — لا بريد إلكتروني.
3. الـ refresh_token يجب أن يكون HttpOnly Cookie دائماً.
4. الاتصال بقاعدة البيانات يجب أن يستخدم poolAdmin (REST / Service Role على منفذ 443) لجميع عمليات المصادقة.
5. الـ access_token قصير العمر (15 دقيقة) ويُحمل في رد JSON + Cookie غير HttpOnly للوصول السريع.