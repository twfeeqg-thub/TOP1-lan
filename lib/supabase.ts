import { createClient } from '@supabase/supabase-js';

/**
 * Lazy loaded Supabase Browser Client
 * Uses public variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase browser environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(url, anonKey);
}

let cachedBrowserClient: any = null;

export const supabase = {
  get client() {
    if (!cachedBrowserClient) {
      cachedBrowserClient = getSupabaseBrowserClient();
    }
    return cachedBrowserClient;
  }
};

/**
 * Lazy loaded Supabase Server/Admin Client (bypasses RLS)
 * Uses private variable SUPABASE_SERVICE_ROLE_KEY
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin environment variables: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let cachedAdminClient: any = null;

export const supabaseAdmin = {
  get client() {
    if (!cachedAdminClient) {
      cachedAdminClient = getSupabaseAdminClient();
    }
    return cachedAdminClient;
  }
};
