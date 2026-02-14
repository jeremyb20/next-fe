'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { KeyPrefix, FlatNamespace } from 'i18next';
import {
  FallbackNs,
  useTranslation,
  UseTranslationOptions,
  UseTranslationResponse,
} from 'react-i18next';

import i18next from './i18next';

const runsOnServerSide = typeof window === 'undefined';

type $Tuple<T> = readonly [T?, ...T[]];

export function useT<
  Ns extends FlatNamespace | $Tuple<FlatNamespace>,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const lang = useParams()?.lang;
  if (typeof lang !== 'string')
    throw new Error('useT is only available inside /app/[lang]');
  if (runsOnServerSide && i18next.resolvedLanguage !== lang) {
    i18next.changeLanguage(lang);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18next.resolvedLanguage) return;
      setActiveLng(i18next.resolvedLanguage);
    }, [activeLng]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lang || i18next.resolvedLanguage === lang) return;
      i18next.changeLanguage(lang);
    }, [lang]);
  }
  return useTranslation(ns, options);
}
