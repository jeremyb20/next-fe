export const fallbackLng = 'es';
export const languages = ['es', 'en', 'fr', 'ar', 'vi', 'zh'];
export const defaultNS = 'translation';
export const headerName = 'x-i18next-current-language';
export const cookieName = 'i18nextLng';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS: ns,
    ns,
    interpolation: {
      escapeValue: false,
    },
  };
}
