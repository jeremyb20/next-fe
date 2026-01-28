'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { localStorageGetItem } from 'src/utils/storage-available';

import { useSettingsContext } from 'src/components/settings';

import { allLangs, defaultLang } from './config-lang';
import { LANGUAGE_NORMALIZATION_MAP } from '../utils/constants';
import { getExchangeRate, DEFAULT_CURRENCY } from '../utils/currency-service';

// ----------------------------------------------------------------------

export function useLocales() {
  const langStorage = localStorageGetItem('i18next');

  // Si no hay idioma guardado, usar español por defecto
  if (!langStorage) {
    return {
      allLangs,
      currentLang: defaultLang,
      symbol: defaultLang.numberFormat?.symbol || '$',
      targetCurrency: defaultLang.numberFormat?.currency || 'USD',
      exchangeRate: getExchangeRate(
        DEFAULT_CURRENCY,
        defaultLang.numberFormat?.currency || 'USD'
      ),
      shouldConvert:
        DEFAULT_CURRENCY !== (defaultLang.numberFormat?.currency || 'USD'),
    };
  }

  // Normalizar el idioma
  let normalizedLang = langStorage;

  // 1. Verificar en el mapa de normalización
  if (LANGUAGE_NORMALIZATION_MAP[langStorage]) {
    normalizedLang = LANGUAGE_NORMALIZATION_MAP[langStorage];
  }
  // 2. Si no está en el mapa pero tiene guión, extraer la primera parte
  else if (langStorage.includes('-')) {
    const baseLang = langStorage.split('-')[0];
    // Verificar si el idioma base está en el mapa
    normalizedLang = LANGUAGE_NORMALIZATION_MAP[baseLang] || baseLang;
  }

  // Buscar el idioma normalizado en allLangs
  const currentLang =
    allLangs.find((lang) => lang.value === normalizedLang) || defaultLang;

  const targetCurrency = currentLang.numberFormat?.currency || 'USD';
  const exchangeRate = getExchangeRate(DEFAULT_CURRENCY, targetCurrency);
  const shouldConvert = DEFAULT_CURRENCY !== targetCurrency;

  // Obtener símbolo de moneda
  const symbol =
    currentLang.numberFormat?.symbol ||
    (currentLang.numberFormat?.currency
      ? new Intl.NumberFormat(currentLang.numberFormat.code, {
          style: 'currency',
          currency: currentLang.numberFormat.currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .formatToParts(0)
          .find((part) => part.type === 'currency')?.value
      : '$');

  return {
    allLangs,
    currentLang,
    symbol,
    targetCurrency,
    exchangeRate,
    shouldConvert,
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
