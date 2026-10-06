import { headers } from 'next/headers';

import { languages } from './i18n/settings';
import { GOOGLE_AD, HOST_API } from '../config-global';
import AppProviders from '../components/providers/AppProviders';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const requestLocale = (await headers()).get('x-locale') || '';
  const language = languages.includes(requestLocale) ? requestLocale : 'es';
  return (
    <html lang={language} dir="ltr" translate="no">
      <head>
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

        {/* AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${GOOGLE_AD}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
