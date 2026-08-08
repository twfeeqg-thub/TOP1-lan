'use client';

import { useState } from 'react';
import type { EditableWorkspaceConfig, WorkspaceContent } from '@/lib/workspace-types';
import { TextArea, TextInput } from './controls';

interface Props {
  value: EditableWorkspaceConfig;
  onChange: (next: EditableWorkspaceConfig) => void;
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function arrayToLines(items: string[] | undefined): string {
  return Array.isArray(items) ? items.join('\n') : '';
}

export function ContentTab({ value, onChange }: Props) {
  const content = value.content ?? {};

  const setContent = <K extends keyof WorkspaceContent>(key: K, val: WorkspaceContent[K]) =>
    onChange({ ...value, content: { ...content, [key]: val } });

  const [featuresArText, setFeaturesArText] = useState(() => arrayToLines(value.features_ar));
  const [featuresEnText, setFeaturesEnText] = useState(() => arrayToLines(value.features_en));

  const commitFeatures = (field: 'features_ar' | 'features_en', text: string) => {
    const list = linesToArray(text);
    onChange({ ...value, [field]: list.length > 0 ? list : undefined });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInput
        label="العنوان الرئيسي بالعربية"
        value={content.hero_headline_ar ?? ''}
        onChange={(e) => setContent('hero_headline_ar', e.target.value)}
      />
      <TextInput
        label="العنوان الرئيسي بالإنجليزية"
        dir="ltr"
        value={content.hero_headline_en ?? ''}
        onChange={(e) => setContent('hero_headline_en', e.target.value)}
      />
      <TextArea
        label="الوصف الترويجي بالعربية"
        rows={3}
        value={content.hero_subtitle_ar ?? ''}
        onChange={(e) => setContent('hero_subtitle_ar', e.target.value)}
      />
      <TextArea
        label="الوصف الترويجي بالإنجليزية"
        rows={3}
        dir="ltr"
        value={content.hero_subtitle_en ?? ''}
        onChange={(e) => setContent('hero_subtitle_en', e.target.value)}
      />
      <TextInput
        label="نص زر الدعوة بالعربية"
        value={content.cta_primary_ar ?? ''}
        onChange={(e) => setContent('cta_primary_ar', e.target.value)}
      />
      <TextInput
        label="نص زر الدعوة بالإنجليزية"
        dir="ltr"
        value={content.cta_primary_en ?? ''}
        onChange={(e) => setContent('cta_primary_en', e.target.value)}
      />
      <TextInput
        label="رسالة الترحيب بالعربية"
        value={content.welcome_ar ?? ''}
        onChange={(e) => setContent('welcome_ar', e.target.value)}
      />
      <TextInput
        label="رسالة الترحيب بالإنجليزية"
        dir="ltr"
        value={content.welcome_en ?? ''}
        onChange={(e) => setContent('welcome_en', e.target.value)}
      />
      <TextArea
        label="الميزات بالعربية (سطر لكل ميزة)"
        rows={4}
        dir="rtl"
        value={featuresArText}
        onChange={(e) => {
          setFeaturesArText(e.target.value);
          commitFeatures('features_ar', e.target.value);
        }}
        hint="كل سطر يمثل ميزة مستقلة"
      />
      <TextArea
        label="الميزات بالإنجليزية (سطر لكل ميزة)"
        rows={4}
        dir="ltr"
        value={featuresEnText}
        onChange={(e) => {
          setFeaturesEnText(e.target.value);
          commitFeatures('features_en', e.target.value);
        }}
        hint="One feature per line"
      />
    </div>
  );
}