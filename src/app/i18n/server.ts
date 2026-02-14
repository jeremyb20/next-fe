import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { languages, defaultNS, fallbackLng } from './settings';

export const initI18next = async (lng: string, ns: string = defaultNS) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/translation.${language}.json`)
      )
    )
    .init({
      supportedLngs: languages,
      fallbackLng,
      lng, // Usar el idioma recibido de la URL
      fallbackNS: defaultNS,
      defaultNS: ns,
      ns,
      preload: languages,
      interpolation: {
        escapeValue: false,
      },
    });

  return i18nInstance;
};

export async function useServerTranslation(lng: string, ns?: string) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns),
    i18n: i18nextInstance,
  };
}
