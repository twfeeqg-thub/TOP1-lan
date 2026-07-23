'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

interface ServiceInfo {
  name_ar?: string;
  name_en?: string;
  icon?: string;
  description_ar?: string;
  description_en?: string;
  type?: string;
  summaryAr?: string;
  summaryEn?: string;
}

interface ProjectData {
  project_slug: string;
  modules_config: ServiceInfo;
}

export default function ServiceHeader({ service }: { service?: string | null }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['service', service],
    queryFn: async (): Promise<ProjectData | null> => {
      if (!service) return null;
      const { data, error } = await supabase.client
        .schema('core')
        .from('project_definitions')
        .select('project_slug, modules_config')
        .eq('project_slug', service)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!service,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  if (!service) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
        <Loader2 size={16} className="animate-spin" />
        <span>جاري تحميل معلومات الخدمة...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={16} />
        <span>تعذر تحميل معلومات الخدمة</span>
      </div>
    );
  }

  const info = data.modules_config;

  return (
    <div className="flex items-center gap-3">
      {info.icon && <span className="text-2xl">{info.icon}</span>}
      <div>
        <h2 className="text-lg font-bold text-[var(--text-main)]">{info.name_ar || info.name_en}</h2>
        {(info.summaryAr || info.summaryEn) && (
          <p className="text-xs text-[var(--text-muted)]">{info.summaryAr || info.summaryEn}</p>
        )}
      </div>
    </div>
  );
}
