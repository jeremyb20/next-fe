// hooks/use-translation.ts (modificado)
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation as useTranslationOrg } from 'react-i18next';

import { setDateTimeLocale } from '@/utils/format-time';

import { fallbackLng } from '../app/i18n/settings';

export function useTranslation(ns?: string) {
  const params = useParams();
  const lng = (params?.lang as string) || fallbackLng;
  const { t, i18n } = useTranslationOrg(ns);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Actualizar el locale global cuando cambie el idioma
    setDateTimeLocale(lng as 'es' | 'en' | 'vi' | 'fr' | 'zh' | 'ar');
  }, [lng, i18n]);

  return {
    t,
    i18n,
    mounted,
    lng,
    tSafe: (key: string, options?: any) => {
      if (!mounted) return key;
      return t(key, options);
    },
  };
}
