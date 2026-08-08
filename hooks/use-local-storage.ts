'use client'

import { useCallback, useSyncExternalStore } from 'react'

type Listener = () => void

const keyListeners = new Map<string, Set<Listener>>()

function notifyKey(key: string) {
  keyListeners.get(key)?.forEach((listener) => listener())
}

export interface UseLocalStorageValueOptions<T> {
  fallback: T
  read: (raw: string | null) => T
  serialize: (value: T) => string
}

/**
 * Hydration-safe localStorage binding backed by useSyncExternalStore.
 * Server renders the fallback; the client snapshot is read after hydration
 * without any synchronous setState-in-effect, so it never trips the React
 * Compiler's set-state-in-effect rule and never causes SSR mismatches.
 */
export function useLocalStorageValue<T>(
  key: string,
  options: UseLocalStorageValueOptions<T>
): [T, (value: T) => void] {
  const { fallback, read, serialize } = options

  const subscribe = useCallback(
    (onStoreChange: Listener) => {
      let set = keyListeners.get(key)
      if (!set) {
        set = new Set()
        keyListeners.set(key, set)
      }
      set.add(onStoreChange)

      const onStorage = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && (event.key === null || event.key === key)) {
          onStoreChange()
        }
      }
      window.addEventListener('storage', onStorage)

      return () => {
        set!.delete(onStoreChange)
        if (set!.size === 0) keyListeners.delete(key)
        window.removeEventListener('storage', onStorage)
      }
    },
    [key]
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return fallback
    return read(window.localStorage.getItem(key))
  }, [key, fallback, read])
  const getServerSnapshot = useCallback(() => fallback, [fallback])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, serialize(next))
      notifyKey(key)
    },
    [key, serialize]
  )

  return [value, setValue]
}

/**
 * Returns true only after the client has hydrated. Used to gate
 * flash-prone UI without mutating state inside an effect.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
