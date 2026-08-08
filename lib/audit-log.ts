// Client-safe audit log types & display helpers.
// Source of truth is core.master_audit_log (server). This module only
// maps DB rows into presentation-ready values.

export type AuditSeverity = 'info' | 'medium' | 'high';

export interface AuditLogEntry {
  id: string;
  action: string;
  action_key: string;
  actor: string;
  actor_role: string | null;
  target_type: string | null;
  target_name: string | null;
  timestamp: string;
  severity: AuditSeverity;
  details: string | null;
}

export const severityLabels: Record<AuditSeverity, string> = {
  info: 'معلومة',
  medium: 'تنبيه',
  high: 'خطأ',
};

export function normalizeSeverity(sev: string | null | undefined): AuditSeverity {
  switch (sev) {
    case 'medium':
    case 'warn':
    case 'warning':
    case 'low':
      return 'medium';
    case 'high':
    case 'error':
    case 'critical':
      return 'high';
    default:
      return 'info';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'medium':
      return 'bg-amber-500';
    case 'high':
      return 'bg-rose-500';
    default:
      return 'bg-sky-500';
  }
}

export function getSeverityGlow(severity: string): string {
  switch (severity) {
    case 'medium':
      return 'shadow-[0_0_12px_rgba(245,158,11,0.5)]';
    case 'high':
      return 'shadow-[0_0_12px_rgba(244,63,94,0.5)]';
    default:
      return 'shadow-[0_0_12px_rgba(14,165,233,0.5)]';
  }
}

const actionLabels: Record<string, string> = {
  'sector.create': 'إنشاء قطاع',
  'sector.update': 'تحديث بيانات القطاع',
  'sector.toggle': 'تبديل حالة القطاع',
  'sector.delete': 'حذف قطاع',
  'project.create': 'إنشاء مشروع',
  'feature.toggle': 'تبديل حالة ميزة',
  'feature.schools': 'تحديث المدارس المفعّلة',
  'ad.create': 'إنشاء إعلان',
  'ad.update': 'تحديث إعلان',
  'ad_request.review': 'مراجعة طلب إعلان',
  'ad_request.create': 'تسجيل طلب إعلان',
  'kill_switch.toggle': 'تبديل إيقاف الطوارئ',
  'override.create': 'إنشاء تخصيص مشروع',
  'override.update': 'تحديث تخصيص مشروع',
  'override.delete': 'حذف تخصيص مشروع',
  'outbox.apply': 'تطبيق عملية مؤجلة',
  'user.login': 'تسجيل دخول',
  'user.logout': 'تسجيل خروج',
};

export function getActionLabel(action: string): string {
  return actionLabels[action] ?? action;
}

export function getTargetTypeLabel(type: string | null): string {
  switch (type) {
    case 'project':
      return 'مشروع';
    case 'project_override':
      return 'تخصيص';
    case 'ad':
      return 'إعلان';
    case 'ad_request':
      return 'طلب إعلان';
    case 'feature':
      return 'ميزة';
    case 'sector':
      return 'قطاع';
    case 'kill_switch':
      return 'إيقاف الطوارئ';
    case 'user':
      return 'مستخدم';
    case 'setting':
      return 'إعدادات';
    default:
      return 'نظام';
  }
}

export function getTargetTypeColor(type: string | null): string {
  switch (type) {
    case 'project':
    case 'project_override':
      return 'text-violet-400 bg-violet-500/10';
    case 'ad':
    case 'ad_request':
      return 'text-pink-400 bg-pink-500/10';
    case 'feature':
      return 'text-cyan-400 bg-cyan-500/10';
    case 'sector':
    case 'kill_switch':
      return 'text-amber-400 bg-amber-500/10';
    case 'user':
      return 'text-emerald-400 bg-emerald-500/10';
    case 'setting':
      return 'text-amber-400 bg-amber-500/10';
    default:
      return 'text-sky-400 bg-sky-500/10';
  }
}
