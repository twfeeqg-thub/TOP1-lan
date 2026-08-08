'use client';

import type { EditableWorkspaceConfig, WorkspaceAppearance } from '@/lib/workspace-types';
import { ColorField, SelectField, TextInput } from './controls';

interface Props {
  value: EditableWorkspaceConfig;
  onChange: (next: EditableWorkspaceConfig) => void;
}

const DENSITY_OPTIONS = [
  { label: 'منخفضة', value: 'low' },
  { label: 'متوسطة', value: 'medium' },
  { label: 'عالية', value: 'high' },
];

const THEME_OPTIONS = [
  { label: 'تلقائي', value: 'auto' },
  { label: 'فاتح', value: 'light' },
  { label: 'داكن', value: 'dark' },
  { label: 'وردي', value: 'pink' },
];

export function AppearanceTab({ value, onChange }: Props) {
  const appearance = value.appearance ?? {};

  const setAppearance = <K extends keyof WorkspaceAppearance>(key: K, val: WorkspaceAppearance[K]) =>
    onChange({ ...value, appearance: { ...appearance, [key]: val } });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ColorField
        label="اللون المميز الرئيسي"
        value={appearance.primary ?? value.accent_color}
        onChange={(c) => {
          setAppearance('primary', c);
          onChange({ ...value, accent_color: c });
        }}
        hint="مطابق لمتغير CSS --primary"
      />
      <ColorField
        label="اللون الخفيف"
        value={appearance.primary_light}
        onChange={(c) => setAppearance('primary_light', c)}
        hint="مطابق لـ --primary-light"
      />
      <ColorField
        label="اللون الإضافي (Accent)"
        value={appearance.accent}
        onChange={(c) => setAppearance('accent', c)}
        hint="متوافق مع الثيم الوردي"
      />
      <ColorField
        label="لون الخلفية"
        value={appearance.background}
        onChange={(c) => setAppearance('background', c)}
      />
      <TextInput
        label="كثافة التمويه الزجاجي (px)"
        dir="ltr"
        type="number"
        min={0}
        max={40}
        value={appearance.glass_blur ?? ''}
        onChange={(e) => setAppearance('glass_blur', e.target.value)}
        placeholder="16"
        hint="الافتراضي 16px"
      />
      <SelectField
        label="كثافة الشبكة"
        value={appearance.grid_density ?? ''}
        onChange={(e) => setAppearance('grid_density', e.target.value as WorkspaceAppearance['grid_density'])}
        options={DENSITY_OPTIONS}
      />
      <SelectField
        label="نمط الثيم المفضل"
        value={appearance.theme ?? ''}
        onChange={(e) => setAppearance('theme', e.target.value as WorkspaceAppearance['theme'])}
        options={THEME_OPTIONS}
        hint="فاتح / داكن / وردي"
      />
    </div>
  );
}