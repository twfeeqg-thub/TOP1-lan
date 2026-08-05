# README_LOGIC.md — app/api/auth/session

## المنطق البشري (HUMAN_LOGIC)

استعادة سياق الجلسة عند تحميل التطبيق أو بعد انتهاء الـ access token. المصدر الوحيد للحقيقة هو كوكي الـ Refresh Token من نوع HttpOnly — لا تُقرأ أي بيانات من تخزين العميل.

## الهيكل الآلي والارتباطات (AUTO_STRUCTURE)

- **route.ts**: يرتبط بـ [ lib/auth-session | lib/subscriptions-server | lib/auth ]

### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)
- **route.ts**: يرتبط بـ [  |  |  ]
