import { sectorsMock, sectorFullData } from './sectors-mock-data'
import type { SectorData } from './sector-types'

export async function getSectorData(slug: string): Promise<SectorData | null> {
  const sector = sectorsMock.find(s => s.slug === slug && s.is_active)
  if (!sector) return null
  return sectorFullData[sector.id] ?? null
}
