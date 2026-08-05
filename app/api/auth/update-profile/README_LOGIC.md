# README_LOGIC.md — app/api/auth/update-profile

## المنطق البشري (HUMAN_LOGIC)

محرك «تعديل بيانات الحساب». يسمح للمشتركين والمالك بتعديل الاسم والهاتف وكلمة المرور بأمان. الهوية تُستخلص خادمياً من كوكي الجلسة HttpOnly ولا يُثق بأي ادعاءات من العميل. أي تغيير لكلمة المرور يتطلب تأكيد كلمة المرور الحالية أولاً. كل تعديل يُسجل في `core.master_audit_log`.

## الهيكل الآلي والارتباطات (AUTO_STRUCTURE)

- **route.ts**: يرتبط بـ [ lib/auth-session | lib/supabase-pool | lib/phone | lib/auth | lib/validators ]

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **route.ts**: يرتبط بـ [  |  |  |  |  ]
