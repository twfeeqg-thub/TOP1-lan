import { sectorsMock, sectorFullData } from './sectors-mock-data'
import type { SectorData } from './sector-types'

export interface SectorResult {
  data: SectorData | null
  isFallback: boolean
}

export async function getSectorData(slug: string): Promise<SectorResult> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { data, error } = await supabaseAdmin.client
      .schema('core')
      .from('sectors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!error && data) {
      return { data: data as unknown as SectorData, isFallback: false }
    }
  } catch {
    // Supabase unavailable — fall through to mock
  }

  const sector = sectorsMock.find(s => s.slug === slug && s.is_active)
  if (!sector) return { data: null, isFallback: false }
  return { data: sectorFullData[sector.id] ?? null, isFallback: true }
}
