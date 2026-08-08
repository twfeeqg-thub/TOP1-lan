'use client';

import { ArrowDown, ArrowUp, Puzzle } from 'lucide-react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import type { EditableWorkspaceConfig, WorkspaceModule } from '@/lib/workspace-types';

interface Props {
  value: EditableWorkspaceConfig;
  onChange: (next: EditableWorkspaceConfig) => void;
}

export function ModulesTab({ value, onChange }: Props) {
  const modules = value.modules ?? [];

  const setModules = (next: WorkspaceModule[]) =>
    onChange({ ...value, modules: next.length > 0 ? next : undefined });

  const toggleModule = (id: string, enabled: boolean) =>
    setModules(modules.map((m) => (m.id === id ? { ...m, enabled } : m)));

  const moveModule = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= modules.length) return;
    const next = [...modules];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setModules(next.map((m, i) => ({ ...m, order: i })));
  };

  if (modules.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Puzzle className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
        <p className="text-sm font-bold text-[var(--text-main)]">لا توجد وحدات فرعية محددة بعد</p>
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          ستظهر الوحدات الفرعية هنا بعد تعريفها في القالب الأساسي للمشروع.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((module, index) => (
        <div
          key={module.id}
          className="glass-card flex items-center gap-3 rounded-2xl p-3.5"
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              aria-label="تحريك لأعلى"
              onClick={() => moveModule(index, -1)}
              disabled={index === 0}
              className="touch-target flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:text-[var(--primary)] disabled:opacity-30"
            >
              <ArrowDown className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="تحريك لأسفل"
              onClick={() => moveModule(index, 1)}
              disabled={index === modules.length - 1}
              className="touch-target flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:text-[var(--primary)] disabled:opacity-30"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[var(--text-main)]">
              {module.label_ar || module.label_en || module.id}
            </p>
            <p dir="ltr" className="truncate text-[11px] text-[var(--text-muted)]">
              {module.id} — ترتيب {module.order}
            </p>
          </div>

          <ToggleSwitch
            checked={module.enabled}
            onChange={(checked) => toggleModule(module.id, checked)}
            label={module.enabled ? 'مفعّل' : 'معطّل'}
          />
        </div>
      ))}
    </div>
  );
}