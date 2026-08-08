import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/supabase-pool'

export const runtime = 'nodejs'

const trackSchema = z.object({
  ad_id: z.string().min(1).max(128),
  action: z.enum(['impression', 'click']),
  slot: z.enum(['top', 'middle', 'bottom']).optional(),
  lang: z.enum(['ar', 'en']).optional(),
})

/**
 * Public ad-tracking endpoint (D6: outside the middleware matcher).
 *
 * Atomic single-statement increment — no read-then-write race, no upsert:
 *
 *   UPDATE core.ads_engine
 *      SET clicks      = CASE WHEN $2 = 'click'      THEN clicks      + 1 ELSE clicks      END,
 *          impressions = CASE WHEN $2 = 'impression' THEN impressions + 1 ELSE impressions END
 *    WHERE id = $1
 *    RETURNING id;
 *
 * The client path is fully wrapped: this route NEVER 500s. Any failure is
 * logged and answered with a neutral 200 so ad rendering is never blocked.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 200 })
  }

  const parsed = trackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 200 })
  }

  const { ad_id, action } = parsed.data

  if (!pool) {
    console.error('[ads:track] pool not configured')
    return NextResponse.json({ ok: false, error: 'storage_unavailable' }, { status: 200 })
  }

  try {
    await pool.query(
      `UPDATE core.ads_engine
          SET clicks      = CASE WHEN $2 = 'click'      THEN clicks      + 1 ELSE clicks      END,
              impressions = CASE WHEN $2 = 'impression' THEN impressions + 1 ELSE impressions END
        WHERE id = $1
        RETURNING id;`,
      [ad_id, action]
    )
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[ads:track] update failed', err)
    return NextResponse.json({ ok: false, error: 'storage_unavailable' }, { status: 200 })
  }
}
