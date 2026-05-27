'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { languages, defaultNS, fallbackLng } from './settings';

// En cliente, el idioma YA está en la URL cuando este código se ejecuta
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string) => import(`./locales/translation.${language}.json`)
    )
  )
  .init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined, // Dejar que LanguageDetector detecte
    fallbackNS: defaultNS,
    defaultNS,
    detection: {
      // Orden: primero la URL (path), luego cookie, luego navegador
      order: ['path', 'cookie', 'htmlTag', 'navigator'],
      caches: ['cookie'], // Guardar en cookie para persistencia
      lookupFromPathIndex: 0, // El primer segmento de la URL es el idioma
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
