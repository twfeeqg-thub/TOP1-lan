'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Postgres schema → React Query cache mapping.
 * Any change event on a table invalidates the master-panel caches that
 * consume it, removing the need for manual refresh buttons.
 */
const REALTIME_TABLE_MAP: Array<{ table: string; caches: string[] }> = [
  { table: 'sectors', caches: ['master-sectors'] },
  { table: 'project_definitions', caches: ['master-projects'] },
  { table: 'master_audit_log', caches: ['master-audit'] },
  { table: 'ads_engine', caches: ['master-ads'] },
  { table: 'ad_requests', caches: ['master-ad-requests'] },
  { table: 'features', caches: ['master-features'] },
  { table: 'kill_switch', caches: ['master-kill-switch'] },
]

/**
 * Hooks the master panel into Supabase Realtime broadcast channels for the
 * core schema tables. On every Postgres change (INSERT/UPDATE/DELETE) the
 * mapped React Query caches are invalidated so dashboards re-fetch
 * automatically. Broadcast requires Realtime enabled for the tables in the
 * Supabase dashboard; when unconfigured or offline it degrades silently.
 */
export function useMasterRealtime(enabled = true): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Broadcasts need a live realtime server; without a configured client
    // there is nothing to subscribe to.
    if (!isSupabaseConfigured) return

    const channel = supabase.client.channel('master-realtime-phase3')

    for (const { table, caches } of REALTIME_TABLE_MAP) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'core', table },
        () => {
          for (const key of caches) {
            queryClient.invalidateQueries({ queryKey: [key] })
          }
        }
      )
    }

    const subscription = channel.subscribe((status: string) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        // The Supabase project may not have Realtime enabled for these
        // tables — the panel keeps working with manual refreshes.
        console.warn('[use-master-realtime] realtime channel unavailable:', status)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, enabled])
}
