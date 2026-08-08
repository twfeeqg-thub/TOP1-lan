'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOffline } from '@/hooks/use-offline';
import {
  enqueueMutation,
  getPendingMutations,
  markApplied,
  markFailed,
  type OutboxMutation,
} from '@/lib/offline-outbox';

/**
 * Drives the upward sync engine: queues master-panel mutations while offline
 * and replays them transactionally through /api/master/sync/outbox once the
 * connection returns.
 */
export function useOutbox() {
  const isOffline = useOffline();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const syncingRef = useRef(false);

  const refreshCount = useCallback(async () => {
    const pending = await getPendingMutations();
    setPendingCount(pending.length);
  }, []);

  const sync = useCallback(async () => {
    if (syncingRef.current || isOffline) return;
    syncingRef.current = true;
    setSyncing(true);
    try {
      const pending = await getPendingMutations();
      for (const entry of pending) {
        try {
          const res = await fetch('/api/master/sync/outbox', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_mutation_id: entry.client_mutation_id,
              action: entry.action,
              entity_type: entry.entity_type,
              entity_id: entry.entity_id,
              payload: entry.payload,
            }),
          });
          const body = await res.json().catch(() => ({}));
          if (res.ok) {
            await markApplied(entry.client_mutation_id);
          } else {
            await markFailed(entry.client_mutation_id, body?.error || 'Sync failed');
          }
        } catch {
          await markFailed(entry.client_mutation_id, 'Network error during sync');
          break;
        }
      }
      setLastSyncAt(Date.now());
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      await refreshCount();
    }
  }, [isOffline, refreshCount]);

  useEffect(() => {
    const t = setTimeout(refreshCount, 0);
    return () => clearTimeout(t);
  }, [refreshCount]);

  useEffect(() => {
    if (!isOffline) {
      const t = setTimeout(sync, 0);
      return () => clearTimeout(t);
    }
  }, [isOffline, sync]);

  return {
    isOffline,
    pendingCount,
    syncing,
    lastSyncAt,
    sync,
    enqueueMutation,
  };
}
