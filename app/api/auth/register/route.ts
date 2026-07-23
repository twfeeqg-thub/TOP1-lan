import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { normalizePhone } from '@/lib/phone';
import { hashPassword, signAccessToken, generateRefreshToken, REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { phone, password, name, push_token } = parsed.data;
    const normalizedPhone = normalizePhone(phone);
    const passwordHash = await hashPassword(password);

    const { data: existing } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('id')
      .eq('phone', normalizedPhone)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    const metadata: Record<string, unknown> = {};
    if (push_token) {
      metadata.push_tokens = [push_token];
    }

    const { data: user, error: insertError } = await poolAdmin.client
      .schema('core')
      .from('users')
      .insert({
        phone: normalizedPhone,
        name: name || null,
        password_hash: passwordHash,
        role: 'user',
        push_tokens: push_token ? [push_token] : [],
        metadata: metadata,
      })
      .select('id, phone, name, role')
      .single();

    if (insertError || !user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
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

    const response = NextResponse.json({
      access_token: accessToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
    }, { status: 201 });

    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
