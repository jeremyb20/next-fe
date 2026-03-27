import { DOMAIN, HOST_API } from '../config-global';
import AppProviders from '../components/providers/AppProviders';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default async function RootLayout({ children, params }: Props) {
  const lang = params.lang?.toLowerCase() || 'es';
  const isRTL = lang === 'ar';
  return (
    <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'} translate="no">
      <head>
        {/* Meta tags para SEO multilingüe */}
        <link rel="alternate" hrefLang="x-default" href={DOMAIN} />
        <link rel="alternate" hrefLang="es" href={DOMAIN} />
        <link rel="alternate" hrefLang="en" href={`${DOMAIN}/en`} />
        <link rel="alternate" hrefLang="fr" href={`${DOMAIN}/fr`} />
        <link rel="alternate" hrefLang="ar" href={`${DOMAIN}/ar`} />
        <link rel="alternate" hrefLang="vi" href={`${DOMAIN}/vi`} />
        <link rel="alternate" hrefLang="zh" href={`${DOMAIN}/zh`} />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color */}
        <meta name="theme-color" content="#161C24" />

        {/* Preconnect */}
        <link rel="preconnect" href={HOST_API} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
