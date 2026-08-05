import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import {
  signAccessToken,
  generateRefreshToken,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_OPTIONS,
  type AuthRole,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const { data: session, error: sessionError } = await poolAdmin.client
      .schema('core')
      .from('sessions')
      .select('id, user_id, expires_at, revoked_at')
      .eq('refresh_token', refreshToken)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    if (session.revoked_at) {
      return NextResponse.json({ error: 'Session revoked' }, { status: 401 });
    }

    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { data: user, error: userError } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('id, phone, role, is_active')
      .eq('id', session.user_id)
      .maybeSingle();

    if (userError || !user || !user.is_active) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
    }

    const nextRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_OPTIONS.maxAge * 1000).toISOString();

    await poolAdmin.client
      .schema('core')
      .from('sessions')
      .update({ refresh_token: nextRefreshToken, expires_at: expiresAt })
      .eq('id', session.id);

    const accessToken = signAccessToken({ userId: user.id, phone: user.phone, role: user.role as AuthRole });

    const response = NextResponse.json({ access_token: accessToken });

    response.cookies.set(REFRESH_COOKIE_NAME, nextRefreshToken, REFRESH_COOKIE_OPTIONS);
    response.cookies.set(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
