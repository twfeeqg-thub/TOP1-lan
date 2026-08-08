'use client';

import type { EditableWorkspaceConfig } from '@/lib/workspace-types';
import { TextInput, TextArea } from './controls';
import { BrandingUploader, type BrandAssetType } from '@/components/admin/BrandingUploader';
import { canUploadBranding } from '@/lib/branding-gate';
import { useAuth } from '@/context/AuthContext';

interface Props {
  value: EditableWorkspaceConfig;
  onChange: (next: EditableWorkspaceConfig) => void;
  tenantId?: string;
}

const ASSET_KEY: Record<BrandAssetType, keyof EditableWorkspaceConfig> = {
  logo: 'logo_url',
  favicon: 'favicon_url',
  pwa_icon: 'pwa_icon_url',
};

export function BrandingTab({ value, onChange, tenantId = 'platform' }: Props) {
  const { user } = useAuth();

  const customUploadFlag = value?.feature?.branding?.custom_upload ?? false;
  const canUpload = canUploadBranding({
    role: user?.role,
    customUploadFlag,
  });

  const set = (key: keyof EditableWorkspaceConfig, val: string) =>
    onChange({ ...value, [key]: val });

  const handleAssetSaved = (type: BrandAssetType, url: string) => {
    const key = ASSET_KEY[type];
    onChange({ ...value, [key]: url || undefined });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="الاسم بالعربية"
          value={value.title_ar ?? ''}
          onChange={(e) => set('title_ar', e.target.value)}
          placeholder="اسم المشروع"
        />
        <TextInput
          label="الاسم بالإنجليزية"
          dir="ltr"
          value={value.title_en ?? ''}
          onChange={(e) => set('title_en', e.target.value)}
          placeholder="Project name"
        />
        <TextArea
          label="الوصف بالعربية"
          rows={3}
          value={value.description_ar ?? ''}
          onChange={(e) => set('description_ar', e.target.value)}
          placeholder="وصف موجز للمشروع…"
        />
        <TextArea
          label="الوصف بالإنجليزية"
          rows={3}
          dir="ltr"
          value={value.description_en ?? ''}
          onChange={(e) => set('description_en', e.target.value)}
          placeholder="Short project description…"
        />
        <TextInput
          label="الأيقونة"
          value={value.icon ?? ''}
          onChange={(e) => set('icon', e.target.value)}
          placeholder="GraduationCap / Layers / …"
          dir="ltr"
        />
        <TextInput
          label="الشارة بالعربية"
          value={value.badge_ar ?? ''}
          onChange={(e) => set('badge_ar', e.target.value)}
          placeholder="مثال: منصة سيادية معتمدة"
        />
        <TextInput
          label="الشارة بالإنجليزية"
          dir="ltr"
          value={value.badge_en ?? ''}
          onChange={(e) => set('badge_en', e.target.value)}
          placeholder="Certified sovereign badge"
        />
      </div>

      {canUpload && (
        <div className="border-t border-[var(--card-border)] pt-5">
          <p className="mb-3 text-sm font-bold text-[var(--text-main)]">أصول البراندنغ (مخصصة)</p>
          <BrandingUploader
            tenantId={tenantId}
            value={{
              logo: value.logo_url,
              favicon: value.favicon_url,
              pwa_icon: value.pwa_icon_url,
            }}
            onSaved={handleAssetSaved}
          />
        </div>
      )}
    </div>
  );
}
