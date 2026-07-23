import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { normalizePhone } from '@/lib/phone';

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ error: 'Phone parameter required' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);

    const { data, error } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('phone', normalized);

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ available: data === null || data.length === 0 });
  } catch {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }
}
