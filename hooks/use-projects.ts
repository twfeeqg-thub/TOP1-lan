'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase, fallbackProjects } from '@/lib/supabase';
import { cacheData, getCachedData } from '@/lib/db';

const PROJECTS_KEY = 'project_definitions';
const ADS_KEY = 'ads_engine';

async function fetchProjectsWithCache() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (!isOnline) {
    const cached = await getCachedData<any[]>(PROJECTS_KEY);
    if (cached) return cached;
    return fallbackProjects;
  }

  try {
    const { data, error } = await supabase.client
      .schema('core')
      .from('project_definitions')
      .select('*');

    if (error) throw error;

    const result = Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
    await cacheData(PROJECTS_KEY, result);
    return result;
  } catch {
    const cached = await getCachedData<any[]>(PROJECTS_KEY);
    if (cached) return cached;
    return fallbackProjects;
  }
}

interface Ad {
  id: string;
  ad_config: {
    title: string;
    description: string;
    targetUrl: string;
    placement: 'top' | 'middle' | 'bottom';
    lang: 'ar' | 'en';
  };
  media_url?: string;
}

const AD_FALLBACK: Ad[] = [
  {
    id: 'demo-ar-top',
    ad_config: {
      title: '🚀 منصة ذكاء سهل للتحول الرقمي',
      description: 'حلول سحابية سيادية متكاملة مع WhatsApp Business API. تواصل معنا لتفعيل قطاعك الرقمي اليوم.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'top', lang: 'ar',
    },
  },
  {
    id: 'demo-ar-middle',
    ad_config: {
      title: '💡 ذكاء سهل',
      description: 'اكتشف خدماتنا السحابية السيادية المتكاملة. قطاعك الرقمي ينتظرك.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'middle', lang: 'ar',
    },
  },
  {
    id: 'demo-ar-bottom',
    ad_config: {
      title: '🔐 منصة سحابية سيادية',
      description: 'حلول رقمية آمنة بالكامل مع تشفير متكامل للبيانات ومعايير Meta.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'bottom', lang: 'ar',
    },
  },
  {
    id: 'demo-en-top',
    ad_config: {
      title: '🚀 Easy Intellect Cloud Platform',
      description: 'Sovereign cloud solutions integrated with WhatsApp Business API. Activate your digital sector today.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'top', lang: 'en',
    },
  },
  {
    id: 'demo-en-middle',
    ad_config: {
      title: '💡 Easy Intellect',
      description: 'Discover our integrated sovereign cloud services. Your digital sector awaits you.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'middle', lang: 'en',
    },
  },
  {
    id: 'demo-en-bottom',
    ad_config: {
      title: '🔐 Sovereign Cloud Platform',
      description: 'Fully secure digital solutions with end-to-end encryption and Meta compliance.',
      targetUrl: 'https://ai-sahl-vip-land-v1.vercel.app',
      placement: 'bottom', lang: 'en',
    },
  },
];

async function fetchAdsWithCache() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (!isOnline) {
    try {
      const cached = await getCachedData<Ad[]>(ADS_KEY);
      if (cached) return cached;
    } catch {
    }
    return AD_FALLBACK;
  }

  try {
    const { data, error } = await supabase.client
      .schema('core')
      .from('ads_engine')
      .select('*');
    if (error) throw error;

    const result = Array.isArray(data) && data.length > 0 ? (data as Ad[]) : AD_FALLBACK;
    try {
      await cacheData(ADS_KEY, result);
    } catch {
    }
    return result;
  } catch {
    try {
      const cached = await getCachedData<Ad[]>(ADS_KEY);
      if (cached) return cached;
    } catch {
    }
    return AD_FALLBACK;
  }
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectsWithCache,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useAds() {
  return useQuery({
    queryKey: ['ads'],
    queryFn: fetchAdsWithCache,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
