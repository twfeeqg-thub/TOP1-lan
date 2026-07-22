'use client';

import { useState, useEffect, useCallback } from 'react';

export function useOffline() {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const goOnline = useCallback(() => setIsOffline(false), []);
  const goOffline = useCallback(() => setIsOffline(true), []);

  useEffect(() => {
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [goOnline, goOffline]);

  return isOffline;
}
