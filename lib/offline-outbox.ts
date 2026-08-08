import { db, type OutboxEntry } from '@/lib/db';

export interface OutboxMutation {
  action: string;
  entity_type: string;
  entity_id?: string;
  payload: Record<string, unknown>;
}

/**
 * Queues a master-panel mutation locally while offline. Each entry carries a
 * client-generated idempotency key so the server can replay it exactly once.
 */
export async function enqueueMutation(mutation: OutboxMutation): Promise<OutboxEntry> {
  const clientMutationId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `mut-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const entry: OutboxEntry = {
    client_mutation_id: clientMutationId,
    action: mutation.action,
    entity_type: mutation.entity_type,
    entity_id: mutation.entity_id,
    payload: mutation.payload,
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
  };
  await db.outbox.add(entry);
  return entry;
}

export async function getPendingMutations(): Promise<OutboxEntry[]> {
  return db.outbox.where('status').equals('pending').sortBy('createdAt');
}

export async function markApplied(clientMutationId: string): Promise<void> {
  await db.outbox
    .where('client_mutation_id')
    .equals(clientMutationId)
    .modify({ status: 'applied', updatedAt: Date.now() });
}

export async function markFailed(clientMutationId: string, error: string): Promise<void> {
  await db.outbox
    .where('client_mutation_id')
    .equals(clientMutationId)
    .modify((entry) => {
      entry.status = 'failed';
      entry.attempts = (entry.attempts ?? 0) + 1;
      entry.lastError = error;
      entry.updatedAt = Date.now();
    });
}

export async function clearApplied(): Promise<void> {
  await db.outbox.where('status').equals('applied').delete();
}
