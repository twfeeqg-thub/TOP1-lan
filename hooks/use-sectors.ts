'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { sectorsMock } from '@/lib/sectors-mock-data'

export interface LandingSector {
  id: string
  name: string
  slug: string
  icon: string
  is_active: boolean
}

const fallbackSectors: LandingSector[] = sectorsMock.map((s) => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  icon: s.icon,
  is_active: s.is_active,
}))

/**
 * Landing-page sectors fed directly from `core.sectors` (anon client).
 * 10-minute staleTime so toggling `is_active` in the master panel is picked up
 * on the public page without hammering the Data API on every render.
 */
export function useSectors() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      const { data, error } = await supabase.client
        .schema('core')
        .from('sectors')
        .select('id, name, slug, icon, is_active')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const rows = Array.isArray(data) ? (data as LandingSector[]) : [];
      return rows.length > 0 ? rows : fallbackSectors;
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
