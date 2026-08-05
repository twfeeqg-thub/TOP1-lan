import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin, logAudit } from '@/lib/supabase-pool';
import { resolveSessionFromRequest } from '@/lib/auth-session';
import { normalizePhone } from '@/lib/phone';
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_OPTIONS,
  type AuthRole,
} from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validators';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    const resolved = await resolveSessionFromRequest(request);
    if (!resolved) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
    }

    const { name, phone, password, current_password } = parsed.data;

    if (password) {
      const validCurrent = await comparePassword(current_password!, resolved.user.password_hash!);
      if (!validCurrent) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
      }
    }

    const updates: Record<string, unknown> = {};
    const changed: string[] = [];

    if (name !== undefined && name !== resolved.user.name) {
      updates.name = name;
      changed.push('name');
    }

    let normalizedPhone: string | null = null;
    if (phone) {
      normalizedPhone = normalizePhone(phone);
      if (normalizedPhone !== resolved.user.phone) {
        const { data: existing } = await poolAdmin.client
          .schema('core')
          .from('users')
          .select('id')
          .eq('phone', normalizedPhone)
          .neq('id', resolved.user.id)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
        }

        const tenantId = resolved.user.metadata?.tenant_id as string | undefined;
        if (tenantId) {
          await poolAdmin.client
            .schema('core')
            .from('tenants')
            .update({ phone: normalizedPhone })
            .eq('id', tenantId);
        }

        updates.phone = normalizedPhone;
        changed.push('phone');
      }
    }

    let passwordHash: string | null = null;
    if (password) {
      passwordHash = await hashPassword(password);
      updates.password_hash = passwordHash;
      changed.push('password');
    }

    if (changed.length === 0) {
      return NextResponse.json({ error: 'No changes to apply' }, { status: 200 });
    }

    const { error: updateError } = await poolAdmin.client
      .schema('core')
      .from('users')
      .update(updates)
      .eq('id', resolved.user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    await logAudit({
      action: 'profile_updated',
      user_id: resolved.user.id,
      entity_type: 'user',
      entity_id: resolved.user.id,
      details: JSON.stringify({ changed }),
      severity: 'info',
    });

    const accessToken = signAccessToken({
      userId: resolved.user.id,
      phone: normalizedPhone ?? resolved.user.phone,
      role: resolved.user.role as AuthRole,
    });

    const response = NextResponse.json({
      user: {
        id: resolved.user.id,
        phone: normalizedPhone ?? resolved.user.phone,
        name: name !== undefined ? name : resolved.user.name,
        role: resolved.user.role,
      },
      access_token: accessToken,
    });

    response.cookies.set(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PATCH = PUT;
