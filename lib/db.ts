import Dexie, { type Table } from 'dexie';

export interface CachedProject {
  id?: number;
  key: string;
  data: unknown;
  updatedAt: number;
}

export class OfflineDB extends Dexie {
  projects!: Table<CachedProject, number>;

  constructor() {
    super('AisahlOfflineDB');
    this.version(1).stores({
      projects: '++id, key, updatedAt',
    });
  }
}

export const db = new OfflineDB();

export async function cacheData(key: string, data: unknown): Promise<void> {
  await db.projects.put({ key, data, updatedAt: Date.now() });
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const entry = await db.projects.where('key').equals(key).first();
  return (entry?.data as T) ?? null;
}

export async function clearCache(): Promise<void> {
  await db.projects.clear();
}
