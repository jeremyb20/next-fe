// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['ar', 'en', 'es', 'fr', 'vi', 'zh'],
  },
  localePath:
    typeof window === 'undefined'
      ? // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('path').resolve('./public/locales')
      : '/locales',
};
