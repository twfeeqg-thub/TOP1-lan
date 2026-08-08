'use client';

import { useOffline } from '@/hooks/use-offline';
import { useHasHydrated } from '@/hooks/use-local-storage';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOffline = useOffline();
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] px-4 py-3"
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
            <WifiOff className="w-5 h-5 shrink-0" style={{ color: 'var(--primary)' }} />
            <span style={{ color: 'var(--text-main)' }}>
              أنت غير متصل، بعض المحتويات قد لا تكون محدثة. سيتم تحديثها تلقائياً عند عودة الاتصال. 🌐
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
