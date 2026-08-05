import { sectorsMock, sectorFullData } from './sectors-mock-data'
import type { SectorData } from './sector-types'

export interface SectorResult {
  data: SectorData | null
  isFallback: boolean
}

function fallbackSector(slug: string): SectorResult {
  const sector = sectorsMock.find(s => s.slug === slug && s.is_active)
  if (!sector) return { data: null, isFallback: false }
  return { data: sectorFullData[sector.id] ?? null, isFallback: true }
}

export async function getSectorData(slug: string): Promise<SectorResult> {
  let result: { data: any; error: any }

  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    result = await supabaseAdmin.client
      .schema('core')
      .from('sectors')
      .select('*')
      .eq('slug', slug)
      .single()
  } catch (e) {
    // Network-level failure (fetch threw) — complete offline fallback to mock only.
    console.error('[get-sector-data] network failure, using fallback', e)
    return fallbackSector(slug)
  }

  // PostgREST error (schema/permission/404) is a REAL database problem: never fake it.
  if (result.error) {
    console.error('[get-sector-data] database error', result.error)
    throw new Error(result.error.message || 'Failed to load sector from database')
  }

  const full = result.data?.full_data
  if (!full || typeof full !== 'object' || Array.isArray(full) || !full.hero) {
    return { data: null, isFallback: false }
  }

  return { data: full as SectorData, isFallback: false }
}