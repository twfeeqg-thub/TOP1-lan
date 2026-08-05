import { NextRequest } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { REFRESH_COOKIE_NAME, type AuthRole } from '@/lib/auth';

export interface SessionUser {
  id: string;
  phone: string;
  name: string | null;
  role: AuthRole;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  password_hash?: string;
}

export interface ResolvedSession {
  user: SessionUser;
  sessionId: string;
  expiresAt: string;
}

/**
 * Resolves the authenticated user solely from the HttpOnly refresh cookie.
 * Never trusts client-side claims — identity always comes from the session row.
 */
export async function resolveSessionFromRequest(
  request: NextRequest
): Promise<ResolvedSession | null> {
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) return null;

  const { data: session } = await poolAdmin.client
    .schema('core')
    .from('sessions')
    .select('id, user_id, expires_at, revoked_at')
    .eq('refresh_token', refreshToken)
    .maybeSingle();

  if (!session) return null;
  if (session.revoked_at) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  const { data: user } = await poolAdmin.client
    .schema('core')
    .from('users')
    .select('id, phone, name, role, is_active, metadata, password_hash')
    .eq('id', session.user_id)
    .maybeSingle();

  if (!user || !user.is_active) return null;

  return {
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name ?? null,
      role: user.role,
      is_active: user.is_active,
      metadata: user.metadata ?? null,
      password_hash: user.password_hash,
    },
    sessionId: session.id,
    expiresAt: session.expires_at,
  };
}
