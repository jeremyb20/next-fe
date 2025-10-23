'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { localStorageGetItem } from 'src/utils/storage-available';

import { useSettingsContext } from 'src/components/settings';

import { allLangs, defaultLang } from './config-lang';

// ----------------------------------------------------------------------

export function useLocales() {
  const langStorage = localStorageGetItem('i18next');

  const currentLang =
    allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  const symbol = currentLang.numberFormat?.currency
    ? new Intl.NumberFormat(currentLang.numberFormat.code, {
        style: 'currency',
        currency: currentLang.numberFormat.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value
    : '$';

  return {
    allLangs,
    currentLang,
    symbol,
  };
}

// ----------------------------------------------------------------------

export function useTranslate() {
  const { t, i18n, ready } = useTranslation();

  const settings = useSettingsContext();

  const onChangeLang = useCallback(
    (newlang: string) => {
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
    },
    [i18n, settings]
  );

  return {
    t,
    i18n,
    ready,
    onChangeLang,
  };
}
