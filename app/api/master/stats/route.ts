import { NextResponse } from 'next/server'
import { getMasterStats } from '@/lib/stats'
import { getOrCompute } from '@/lib/kpi-cache'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const data = await getOrCompute('master-stats', 60_000, getMasterStats)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30',
      },
    })
  } catch (err) {
    console.error('[master:stats] GET failed', err)
    return NextResponse.json({ error: 'فشل جلب الإحصائيات' }, { status: 500 })
  }
}
