// hooks/useTranslate.ts

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation as useTranslationOrg } from 'react-i18next';

import { fallbackLng } from '../app/i18n/settings';

export function useTranslation(ns?: string) {
  const params = useParams();
  const lng = (params?.lng as string) || fallbackLng;
  const { t, i18n } = useTranslationOrg(ns);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [lng, i18n]);

  return {
    t,
    i18n,
    mounted,
    // Versión segura para SSR
    tSafe: (key: string, options?: any) => {
      if (!mounted) return key; // Placeholder durante SSR
      return t(key, options);
    },
  };
}
