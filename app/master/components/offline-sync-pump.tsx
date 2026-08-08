'use client'

import { Cloud, CloudOff, RefreshCw } from 'lucide-react'
import { useOutbox } from '@/hooks/use-outbox'
import { cn } from '@/lib/utils'

/**
 * Global upward-sync pump mounted inside the master shell. Auto-replays the
 * offline outbox whenever the connection returns and shows a discreet status
 * pill while there is anything to display.
 */
export function OfflineSyncPump() {
  const { isOffline, pendingCount, syncing, sync } = useOutbox()

  if (!isOffline && pendingCount === 0 && !syncing) return null

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      <button
        onClick={() => sync()}
        disabled={syncing || isOffline || pendingCount === 0}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium',
          'glass-card shadow-lg transition-all disabled:opacity-70',
          isOffline
            ? 'border-amber-500/40'
            : pendingCount > 0
              ? 'border-[var(--primary)]/40'
              : 'border-emerald-500/40'
        )}
      >
        {isOffline ? (
          <>
            <CloudOff className="w-4 h-4 text-amber-400" />
            غير متصل — {pendingCount} عملية معلقة
          </>
        ) : syncing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
            جاري المزامنة...
          </>
        ) : (
          <>
            <Cloud className="w-4 h-4 text-[var(--primary)]" />
            {pendingCount} عملية بانتظار المزامنة
          </>
        )}
      </button>
    </div>
  )
}
