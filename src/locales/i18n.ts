'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { defaultLang } from './config-lang';
import translationEn from './langs/en.json';
import translationFr from './langs/fr.json';
import translationVi from './langs/vi.json';
import translationCn from './langs/cn.json';
import translationAr from './langs/ar.json';
import translationEs from './langs/es.json';

// ----------------------------------------------------------------------

// Initialize only once
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translations: translationEn },
        fr: { translations: translationFr },
        vi: { translations: translationVi },
        cn: { translations: translationCn },
        ar: { translations: translationAr },
        es: { translations: translationEs },
      },
      detection: {
        order: ['localStorage', 'navigator', 'cookie'],
        caches: ['localStorage', 'cookie'],
        lookupLocalStorage: 'i18next',
      },
      fallbackLng: defaultLang.value,
      ns: ['translations'],
      defaultNS: 'translations',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
