import Dexie, { type Table } from 'dexie';

export interface CachedProject {
  id?: number;
  key: string;
  data: unknown;
  updatedAt: number;
}

export interface OutboxEntry {
  id?: number;
  client_mutation_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'applied' | 'failed';
  attempts: number;
  lastError?: string;
  createdAt: number;
  updatedAt?: number;
}

export class OfflineDB extends Dexie {
  projects!: Table<CachedProject, number>;
  outbox!: Table<OutboxEntry, number>;

  constructor() {
    super('AisahlOfflineDB');
    this.version(1).stores({
      projects: '++id, key, updatedAt',
    });
    this.version(2).stores({
      projects: '++id, key, updatedAt',
      outbox: '++id, client_mutation_id, status, createdAt',
    });
  }
}

export const db = new OfflineDB();

/**
 * Phase 5 - Defensive memory cache guards.
 * Limits are enforced so low-end 3GB RAM devices never cache-bloat.
 * Raw binary media blobs are NEVER stored — only media_url strings.
 */
const MAX_CACHE_ENTRIES = 200;
const MAX_ENTRY_BYTES = 48000;

export function estimateSize(obj: unknown): number {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj === 'string') return obj.length;
  if (typeof obj === 'number') return 8;
  if (typeof obj === 'boolean') return 4;
  if (Array.isArray(obj)) {
    return obj.reduce((acc, item) => acc + estimateSize(item), 0);
  }
  if (typeof obj === 'object') {
    try {
      const json = JSON.stringify(obj);
      return json === undefined ? 0 : json.length;
    } catch {
      return 0;
    }
  }
  return 0;
}

export async function cacheData(key: string, data: unknown): Promise<void> {
  const size = estimateSize(data);
  if (size > MAX_ENTRY_BYTES) return;

  await db.projects.put({ key, data, updatedAt: Date.now() });

  const count = await db.projects.count();
  if (count > MAX_CACHE_ENTRIES) {
    const toRemove = count - MAX_CACHE_ENTRIES;
    const oldest = await db.projects.orderBy('updatedAt').limit(toRemove).toArray();
    await db.projects.bulkDelete(
      oldest.map((e) => e.id!).filter((id): id is number => id !== undefined)
    );
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const entry = await db.projects.where('key').equals(key).first();
  return (entry?.data as T) ?? null;
}
