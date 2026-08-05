import { NextRequest, NextResponse } from 'next/server';
import { pool, poolAdmin } from '@/lib/supabase-pool';
import { normalizePhone } from '@/lib/phone';
import {
  hashPassword,
  signAccessToken,
  generateRefreshToken,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_OPTIONS,
  type AuthRole,
} from '@/lib/auth';
import { registerSchema } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { phone, password, name, service, push_token } = parsed.data;
    const normalizedPhone = normalizePhone(phone);
    const passwordHash = await hashPassword(password);

    if (!pool) {
      return NextResponse.json({ error: 'Database pool is not configured' }, { status: 500 });
    }

    let user: { id: string; phone: string; name: string | null; role: string };
    let tenantId: string;
    let subscriptionSlugs: string[] = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const conflict = await client.query('SELECT id FROM core.users WHERE phone = $1', [normalizedPhone]);
      if ((conflict.rowCount ?? 0) > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }

      const tenantResult = await client.query(
        'INSERT INTO core.tenants (name, phone) VALUES ($1, $2) RETURNING id',
        [name || null, normalizedPhone]
      );
      tenantId = tenantResult.rows[0].id;

      const userResult = await client.query(
        `INSERT INTO core.users (phone, name, password_hash, role, push_tokens, metadata)
         VALUES ($1, $2, $3, 'user', $4, $5)
         RETURNING id, phone, name, role`,
        [
          normalizedPhone,
          name || null,
          passwordHash,
          push_token ? [push_token] : [],
          { tenant_id: tenantId },
        ]
      );
      user = userResult.rows[0];

      if (service) {
        await client.query(
          `INSERT INTO core.user_subscriptions (user_id, tenant_id, project_slug, plan, is_active, expires_at)
           VALUES ($1, $2, $3, 'pro', true, NULL)
           ON CONFLICT (user_id, project_slug) DO NOTHING`,
          [user.id, tenantId, service]
        );
        subscriptionSlugs = [service];
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      if ((err as { code?: string }).code === '23505') {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }
      throw err;
    } finally {
      client.release();
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

    const accessToken = signAccessToken({ userId: user.id, phone: normalizedPhone, role: user.role as AuthRole });

    const response = NextResponse.json({
      access_token: accessToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
      tenant: { id: tenantId },
      subscriptions: subscriptionSlugs,
    }, { status: 201 });

    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    response.cookies.set(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
