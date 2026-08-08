'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deepDiff, type JsonObject } from '@/lib/overrides-merge';
import type { EditableWorkspaceConfig } from '@/lib/workspace-types';

export interface ClientConfigResponse {
  projectSlug: string;
  tenantId: string;
  baseline: JsonObject;
  override: JsonObject;
  compiled: JsonObject;
  version: number;
}

export type WorkspaceTab = 'branding' | 'appearance' | 'content' | 'modules';

async function fetchClientConfig(tenantId: string, projectSlug: string): Promise<ClientConfigResponse> {
  const res = await fetch(
    `/api/client/overrides?tenantId=${encodeURIComponent(tenantId)}&projectSlug=${encodeURIComponent(projectSlug)}`,
    { cache: 'no-store' }
  );
  if (res.status === 401 || res.status === 403) {
    const error = new Error('FORBIDDEN') as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  if (!res.ok) {
    const error = new Error(`فشل تحميل الإعدادات (${res.status})`) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/**
 * "فارغ بحيث لا يظهر في الفرق" — empty sections ({} and [] for modules) are
 * normalized away so an untouched tab never pollutes the stored delta.
 */
function normalizeSurface(compiled: JsonObject): EditableWorkspaceConfig {
  const cfg = compiled as Partial<EditableWorkspaceConfig>;
  const appearance = cfg.appearance && Object.keys(cfg.appearance).length > 0 ? { ...cfg.appearance } : undefined;
  const content = cfg.content && Object.keys(cfg.content).length > 0 ? { ...cfg.content } : undefined;
  const modules =
    Array.isArray(cfg.modules) && cfg.modules.length > 0
      ? cfg.modules.map((m) => ({ ...m, enabled: m.enabled !== false, order: Number(m.order) || 0 }))
      : undefined;
  return { ...cfg, appearance, content, modules };
}

export function useClientWorkspace(tenantId: string, projectSlug: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ['client-overrides', tenantId, projectSlug] as const,
    [tenantId, projectSlug]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchClientConfig(tenantId, projectSlug),
    staleTime: 30_000,
    retry: 1,
  });

  const [draft, setDraftState] = useState<EditableWorkspaceConfig>({});
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('branding');
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Initial draft is adjusted the very first time the compiled config arrives.
  // Follows the documented "store previous state" render-adjust pattern so we
  // never trip `set-state-in-effect` — the draft keeps the user's edited values
  // after a successful save refetches `data`.
  const [prevData, setPrevData] = useState<ClientConfigResponse | null | undefined>(null);
  if (data && !initialized && data !== prevData) {
    setPrevData(data);
    setDraftState(normalizeSurface(data.compiled));
    setInitialized(true);
  }

  const patchConfig = useCallback((next: EditableWorkspaceConfig) => {
    setDraftState(next);
    setSaveState('idle');
  }, []);

  const save = useCallback(async () => {
    if (!data || saving) return;

    setSaving(true);
    setSaveState('saving');
    try {
      const delta = deepDiff(data.baseline, draft as unknown as JsonObject);
      const client_mutation_id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `ovr-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const res = await fetch('/api/client/overrides', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_mutation_id,
          tenant_id: tenantId,
          project_slug: projectSlug,
          config_override: delta,
        }),
      });

      if (!res.ok) throw new Error(`save failed: ${res.status}`);
      const body = await res.json();

      if (body?.data?.duplicated) {
        setSaveState('saved');
        return;
      }

      await queryClient.invalidateQueries({ queryKey });
      setSaveState('saved');
    } catch {
      setSaveState('error');
    } finally {
      setSaving(false);
    }
  }, [data, draft, saving, tenantId, projectSlug, queryClient, queryKey]);

  const resetDraft = useCallback(() => {
    if (!data) return;
    setDraftState(normalizeSurface(data.compiled));
    setSaveState('idle');
  }, [data]);

  return {
    data,
    draft,
    patchConfig,
    save,
    saving,
    saveState,
    resetDraft,
    isLoading,
    isError,
    refetch,
    activeTab,
    setActiveTab,
    version: data?.version ?? 0,
  };
}