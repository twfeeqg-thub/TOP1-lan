import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { normalizePhone } from '@/lib/phone';
import { comparePassword, signAccessToken, generateRefreshToken, REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { phone, password, push_token } = parsed.data;
    const normalizedPhone = normalizePhone(phone);

    const { data: user, error: fetchError } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('id, phone, name, role, password_hash, push_tokens, is_active')
      .eq('phone', normalizedPhone)
      .maybeSingle();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 });
    }

    if (push_token) {
      const existingTokens: string[] = Array.isArray(user.push_tokens) ? user.push_tokens : [];
      if (!existingTokens.includes(push_token)) {
        await poolAdmin.client
          .schema('core')
          .from('users')
          .update({ push_tokens: [...existingTokens, push_token] })
          .eq('id', user.id);
      }
    }

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_OPTIONS.maxAge * 1000).toISOString();

    await poolAdmin.client
      .schema('core')
      .from('sessions')
      .insert({
        user_id: user.id,
        refresh_token: refreshToken,
        user_agent: request.headers.get('user-agent') || null,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        expires_at: expiresAt,
      });

    const accessToken = signAccessToken({ userId: user.id, phone: normalizedPhone, role: user.role });

    const isSuperAdmin = user.role === 'super_admin';
    const redirectTo = isSuperAdmin ? '/master' : undefined;

    const response = NextResponse.json({
      access_token: accessToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
      redirect_to: redirectTo,
    });

    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    response.cookies.set('aisahl_access_token', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 900,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
