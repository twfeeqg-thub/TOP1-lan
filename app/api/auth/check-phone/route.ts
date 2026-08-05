import { NextRequest, NextResponse } from 'next/server';
import { poolAdmin } from '@/lib/supabase-pool';
import { normalizePhone } from '@/lib/phone';

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get('phone');
    const exclude = request.nextUrl.searchParams.get('exclude') ?? null;
    if (!phone) {
      return NextResponse.json({ error: 'Phone parameter required' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const excludeNormalized = exclude ? normalizePhone(exclude) : null;

    const { data, error } = await poolAdmin.client
      .schema('core')
      .from('users')
      .select('phone')
      .eq('phone', normalized);

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const rows = Array.isArray(data) ? data : [];
    const isSelf = rows.length === 1 && excludeNormalized != null && rows[0].phone === excludeNormalized;

    return NextResponse.json({ available: rows.length === 0 || isSelf });
  } catch {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }
}
