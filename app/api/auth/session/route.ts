import { NextRequest, NextResponse } from 'next/server';
import { resolveSessionFromRequest } from '@/lib/auth-session';
import { fetchUserSubscriptions } from '@/lib/subscriptions-server';
import {
  signAccessToken,
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_OPTIONS,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const resolved = await resolveSessionFromRequest(request);
    if (!resolved) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const subscriptions = await fetchUserSubscriptions(resolved.user.id);
    const accessToken = signAccessToken({
      userId: resolved.user.id,
      phone: resolved.user.phone,
      role: resolved.user.role,
    });

    const response = NextResponse.json({
      user: {
        id: resolved.user.id,
        phone: resolved.user.phone,
        name: resolved.user.name,
        role: resolved.user.role,
      },
      subscriptions,
      access_token: accessToken,
    });

    response.cookies.set(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
