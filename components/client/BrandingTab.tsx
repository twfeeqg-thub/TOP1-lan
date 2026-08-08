'use client';

import type { EditableWorkspaceConfig } from '@/lib/workspace-types';
import { TextInput, TextArea } from './controls';

interface Props {
  value: EditableWorkspaceConfig;
  onChange: (next: EditableWorkspaceConfig) => void;
}

export function BrandingTab({ value, onChange }: Props) {
  const set = (key: keyof EditableWorkspaceConfig, val: string) =>
    onChange({ ...value, [key]: val });

  return (
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
  );
}