import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { REFRESH_COOKIE_NAME } from '@/lib/auth';

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
    response.cookies.set(REFRESH_COOKIE_NAME, '', { ...request.cookies.get(REFRESH_COOKIE_NAME), maxAge: 0, path: '/api/auth' });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
