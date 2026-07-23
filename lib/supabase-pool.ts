import { createClient } from '@supabase/supabase-js';

export function getPoolAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'core' },
  });
}

let cachedPoolClient: ReturnType<typeof getPoolAdminClient> | null = null;

export const poolAdmin = {
  get client() {
    if (!cachedPoolClient) {
      cachedPoolClient = getPoolAdminClient();
    }
    return cachedPoolClient;
  },
};
