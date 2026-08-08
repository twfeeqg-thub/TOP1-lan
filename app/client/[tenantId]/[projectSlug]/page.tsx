'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Loader2,
  Palette,
  Puzzle,
  RotateCcw,
  ScrollText,
  Shapes,
  ShieldAlert,
  Tags,
} from 'lucide-react';
import { useClientWorkspace, type WorkspaceTab } from '@/hooks/use-client-workspace';
import { BrandingTab } from '@/components/client/BrandingTab';
import { AppearanceTab } from '@/components/client/AppearanceTab';
import { ContentTab } from '@/components/client/ContentTab';
import { ModulesTab } from '@/components/client/ModulesTab';
import { cn } from '@/lib/utils';

interface TabDef {
  id: WorkspaceTab;
  label: string;
  icon: typeof Palette;
}

const TABS: TabDef[] = [
  { id: 'branding', label: 'الهوية', icon: Tags },
  { id: 'appearance', label: 'المظهر', icon: Palette },
  { id: 'content', label: 'المحتوى', icon: ScrollText },
  { id: 'modules', label: 'الوحدات', icon: Puzzle },
];

export default function ClientCustomizerPage() {
  const router = useRouter();
  const params = useParams<{ tenantId: string; projectSlug: string }>();
  const tenantId = String(params?.tenantId ?? '');
  const projectSlug = String(params?.projectSlug ?? '');

  const ws = useClientWorkspace(tenantId, projectSlug);

  if (ws.isLoading || (!ws.data && !ws.isError)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-[var(--text-muted)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <p className="text-sm">جارٍ تحميل إعدادات المشروع…</p>
      </div>
    );
  }

  if (ws.isError || !ws.data) {
    return (
      <div className="glass-card mx-auto max-w-md rounded-3xl p-8 text-center">
        <ShieldAlert className="mx-auto mb-3 h-9 w-9 text-amber-500" />
        <p className="text-sm font-bold text-[var(--text-main)]">
          لا تملك صلاحية الوصول لهذا المشروع أو حدث خطأ في التحميل
        </p>
        <button
          type="button"
          onClick={() => ws.refetch()}
          className="touch-target mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const title = (ws.draft as { title_ar?: string }).title_ar || ws.data.projectSlug;

  return (
    <div className="space-y-5">
      {/* Project header */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
              <Shapes className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-[var(--text-main)]">{title}</h2>
              <p dir="ltr" className="truncate text-[11px] text-[var(--text-muted)]">
                {projectSlug}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-[11px] font-bold text-[var(--primary)]">
            الإصدار v{ws.data.version}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-500">
            جاهز للتخصيص
          </span>
        </div>
      </div>

      {/* Tab bar + panel */}
      <div className="glass-card overflow-hidden rounded-3xl">
        <div
          role="tablist"
          aria-label="تبويبات التخصيص"
          className="grid grid-cols-2 gap-1 border-b border-[var(--card-border)] p-2 sm:grid-cols-4"
        >
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const active = ws.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => ws.setActiveTab(tab.id)}
                className={cn(
                  'touch-target flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition-all',
                  active
                    ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)]'
                )}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {ws.activeTab === 'branding' && (
            <BrandingTab value={ws.draft} onChange={ws.patchConfig} />
          )}
          {ws.activeTab === 'appearance' && (
            <AppearanceTab value={ws.draft} onChange={ws.patchConfig} />
          )}
          {ws.activeTab === 'content' && <ContentTab value={ws.draft} onChange={ws.patchConfig} />}
          {ws.activeTab === 'modules' && <ModulesTab value={ws.draft} onChange={ws.patchConfig} />}
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--card-border)] bg-[var(--topbar-bg)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {ws.saveState === 'saved' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                تم حفظ التغييرات
              </span>
            )}
            {ws.saveState === 'error' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                <ShieldAlert className="h-4 w-4" />
                فشل الحفظ — حاول مجدداً
              </span>
            )}
            {ws.saveState === 'idle' && (
              <span className="hidden text-xs text-[var(--text-muted)] sm:block">
                يحفظ الفروقات فقط بعد كل تعديل
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => ws.resetDraft()}
              disabled={ws.saving}
              className="touch-target min-h-[44px] rounded-xl px-4 text-xs font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-hover-bg)] disabled:opacity-50"
            >
              إعادة الضبط
            </button>
            <button
              type="button"
              onClick={() => ws.save()}
              disabled={ws.saving}
              className="touch-target flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              {ws.saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الحفظ…
                </>
              ) : (
                'حفظ التخصيص'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="touch-target hidden min-h-[44px] rounded-xl border border-white/10 px-4 text-xs font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-hover-bg)] sm:block"
            >
              عودة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}