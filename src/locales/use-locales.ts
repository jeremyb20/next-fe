'use client';

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from '@/routes/hooks';
import { localStorageGetItem } from '@/utils/storage-available';

import { allLangs, defaultLang } from './config-lang';
import { useSettingsContext } from '../components/settings';
import { languages, cookieName } from '../app/i18n/settings';
import { LANGUAGE_NORMALIZATION_MAP } from '../utils/constants';
import { getExchangeRate, DEFAULT_CURRENCY } from '../utils/currency-service';

// ----------------------------------------------------------------------

export function useLocales() {
  const langStorage = localStorageGetItem('i18nextLng');
  // const params = useParams();
  // const langStorage = params?.lang as string;
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

// export function useTranslate() {
//   const { t, i18n } = useTranslation();
//   const pathname = usePathname();
//   const router = useRouter();

//   const onChangeLang = useCallback(
//     (newlang: string) => {
//       if (newlang === i18n.language) return;

//       // Obtener la ruta actual sin el idioma
//       const segments = pathname.split('/').filter(Boolean);

//       // Si el primer segmento es un idioma, removerlo
//       if (languages.includes(segments[0] as any)) {
//         segments.shift();
//       }

//       // Construir la nueva ruta
//       const newPath = `/${newlang}/${segments.join('/')}`.replace(/\/+$/, '');

//       // Cambiar idioma
//       i18n.changeLanguage(newlang);

//       // Navegar
//       router.push(newPath);
//     },
//     [i18n, pathname, router]
//   );

//   return {
//     t,
//     i18n,
//     onChangeLang,
//     currentLanguage: i18n.language,
//   };
// }

export function useTranslate() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const settings = useSettingsContext();

  // Sincronizar i18n con la URL (por si acaso)
  useEffect(() => {
    const urlLang = pathname.split('/')[1];
    if (
      urlLang &&
      languages.includes(urlLang as any) &&
      urlLang !== i18n.language
    ) {
      i18n.changeLanguage(urlLang);
    }
  }, [pathname, i18n]);

  const onChangeLang = useCallback(
    (newlang: string) => {
      if (newlang === i18n.language) return;

      // Obtener ruta sin idioma
      const segments = pathname.split('/').filter(Boolean);
      if (languages.includes(segments[0] as any)) {
        segments.shift();
      }
      const pathWithoutLang =
        `/${segments.join('/')}`.replace(/\/+$/, '') || '/';

      // Actualizar cookie
      document.cookie = `${cookieName}=${newlang}; path=/; max-age=31536000; SameSite=Lax`;

      // Cambiar idioma en i18n
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
      // Navegar - el router se encarga del prefijo
      router.push(pathWithoutLang, undefined, newlang);
    },
    [i18n, pathname, router, settings]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLanguage: i18n.language,
    languages,
    getLocalizedPath: useCallback(
      (path: string, lng?: string) =>
        router.getLocalizedPath(path, lng || i18n.language),
      [router, i18n.language]
    ),
  };
}
