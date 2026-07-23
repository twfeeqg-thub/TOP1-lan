import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { verifyAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAccessToken(authHeader.slice(7));
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { push_token } = body;
    if (!push_token || typeof push_token !== 'string') {
      return NextResponse.json({ error: 'push_token required' }, { status: 400 });
    }

    const { data: user } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('push_tokens')
      .eq('id', payload.userId)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingTokens: string[] = Array.isArray(user.push_tokens) ? user.push_tokens : [];
    if (existingTokens.includes(push_token)) {
      return NextResponse.json({ success: true });
    }

    await poolAdmin.client
      .schema('core')
      .from('users')
      .update({ push_tokens: [...existingTokens, push_token] })
      .eq('id', payload.userId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
