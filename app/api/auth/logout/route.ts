import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { REFRESH_COOKIE_NAME, ACCESS_COOKIE_NAME, REFRESH_COOKIE_OPTIONS, ACCESS_COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      await poolAdmin.client
        .schema('core')
        .from('sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('refresh_token', refreshToken);
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(REFRESH_COOKIE_NAME, '', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set(ACCESS_COOKIE_NAME, '', { ...ACCESS_COOKIE_OPTIONS, maxAge: 0 });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
