import { pool } from '@/lib/supabase-pool'

export interface KpiStat {
  title: string
  value: string
  change: string
  up: boolean
}

export interface MasterStats {
  computedAt: string
  stats: KpiStat[]
}

interface StatsRow {
  active_users: string
  users_7d: string
  active_projects: string
  projects_30d: string
  active_ads: string
  ads_30d: string
  pending_requests: string
  requests_7d: string
  active_features: string
  total_features: string
  audits_24h: string
}

const QUERY = `
  SELECT
    (SELECT count(*)::int FROM core.users WHERE is_active) AS active_users,
    (SELECT count(*)::int FROM core.users WHERE is_active AND created_at > now() - interval '7 days') AS users_7d,
    (SELECT count(*)::int FROM core.project_definitions WHERE is_active) AS active_projects,
    (SELECT count(*)::int FROM core.project_definitions WHERE created_at > now() - interval '30 days') AS projects_30d,
    (SELECT count(*)::int FROM core.ads_engine WHERE is_active) AS active_ads,
    (SELECT count(*)::int FROM core.ads_engine WHERE created_at > now() - interval '30 days') AS ads_30d,
    (SELECT count(*)::int FROM core.ad_requests WHERE status = 'pending') AS pending_requests,
    (SELECT count(*)::int FROM core.ad_requests WHERE created_at > now() - interval '7 days') AS requests_7d,
    (SELECT count(*)::int FROM core.features WHERE is_active) AS active_features,
    (SELECT count(*)::int FROM core.features) AS total_features,
    (SELECT count(*)::int FROM core.master_audit_log WHERE created_at > now() - interval '24 hours') AS audits_24h
`;

export async function getMasterStats(): Promise<MasterStats> {
  if (!pool) throw new Error('DATABASE_URL not configured');
  const { rows } = await pool.query<StatsRow>(QUERY);
  const r = rows[0];

  const n = (v: string): number => Number(v) || 0;

  const stats: KpiStat[] = [
    {
      title: 'المستخدمون النشطون',
      value: n(r.active_users).toLocaleString('en-US'),
      change: `+${n(r.users_7d)} هذا الأسبوع`,
      up: true,
    },
    {
      title: 'المشاريع الجارية',
      value: n(r.active_projects).toLocaleString('en-US'),
      change: `+${n(r.projects_30d)} هذا الشهر`,
      up: true,
    },
    {
      title: 'الإعلانات النشطة',
      value: n(r.active_ads).toLocaleString('en-US'),
      change: `+${n(r.ads_30d)} هذا الشهر`,
      up: true,
    },
    {
      title: 'طلبات الإعلانات المعلقة',
      value: n(r.pending_requests).toLocaleString('en-US'),
      change: `+${n(r.requests_7d)} هذا الأسبوع`,
      up: true,
    },
    {
      title: 'الميزات المفعّلة',
      value: `${n(r.active_features)} / ${n(r.total_features)}`,
      change: 'من إجمالي الميزات',
      up: true,
    },
    {
      title: 'سجلات التدقيق (آخر 24س)',
      value: n(r.audits_24h).toLocaleString('en-US'),
      change: 'حدث مسجّل',
      up: true,
    },
  ];

  return { computedAt: new Date().toISOString(), stats };
}
