// In-memory TTL cache with single-flight deduplication for KPI endpoints.
// Server-side only. Keeps the DB load bounded while serving fresh-enough
// dashboard numbers to many concurrent master clients.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export async function getOrCompute<T>(
  key: string,
  ttlMs: number,
  compute: () => Promise<T>
): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  const running = inflight.get(key);
  if (running) return running as Promise<T>;

  const promise = compute()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

export function invalidateKpiCache(key?: string): void {
  if (key) cache.delete(key);
  else cache.clear();
}
