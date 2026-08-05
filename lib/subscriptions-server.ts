import { poolAdmin } from '@/lib/supabase-pool';
import { EDUCATIONAL_PROJECT_SLUGS, type SubscriptionPlan } from '@/lib/subscriptions';

export async function fetchUserSubscriptions(userId: string): Promise<string[]> {
  const { data, error } = await poolAdmin.client
    .schema('core')
    .from('user_subscriptions')
    .select('project_slug')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('[subscriptions] fetch failed', error);
    return [];
  }

  return (data as { project_slug: string }[] | null)?.map((s) => s.project_slug) ?? [];
}

export async function ensureSuperAdminSubscriptions(userId: string): Promise<void> {
  const rows = EDUCATIONAL_PROJECT_SLUGS.map((slug) => ({
    user_id: userId,
    project_slug: slug,
    plan: 'enterprise' as SubscriptionPlan,
    is_active: true,
    expires_at: null,
  }));

  const { error } = await poolAdmin.client
    .schema('core')
    .from('user_subscriptions')
    .upsert(rows, { onConflict: 'user_id,project_slug' });

  if (error) {
    console.error('[subscriptions] ensureSuperAdmin failed', error);
  }
}
