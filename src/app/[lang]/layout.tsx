// import '@/global.css';
// import '@/locales/i18n';

// // ----------------------------------------------------------------------

// import ThemeProvider from '@/theme';
// import { LocalizationProvider } from '@/locales';
// import { primaryFont } from '@/theme/typography';
// import { AuthProvider } from '@/auth/context/jwt';
// import QueryProvider from '@/query/query-provider';

// import ProgressBar from '@/components/progress-bar';
// import { MotionLazy } from '@/components/animate/motion-lazy';
// import SnackbarProvider from '@/components/snackbar/snackbar-provider';
// import {
//   SettingsDrawer,
//   defaultSettings,
//   SettingsProvider,
// } from '@/components/settings';

// import { CheckoutProvider } from '@/sections/checkout/context';

// import { HOST_API } from '../../config-global';
// import LocaleProvider from '../../locales/provider';
// import { getServerLanguage } from '../../utils/get-server-language';
// // import { AuthProvider } from '@/auth/context/auth0';
// // import { AuthProvider } from '@/auth/context/amplify';
// // import { AuthProvider } from '@/auth/context/firebase';
// // import { AuthProvider } from '@/auth/context/supabase';

// // ----------------------------------------------------------------------

// type Props = {
//   children: React.ReactNode;
// };

// export default async function RootLayout({ children }: Props) {
//   const language = await getServerLanguage();
//   return (
//     <html
//       lang={language.toLowerCase() || 'es'}
//       className={primaryFont.className}
//       translate="no"
//     >
//       <head>
//         {/* Viewport - importante para SEO móvil */}
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, maximum-scale=1"
//         />

//         {/* Favicons - pueden ser estáticos */}
//         <link rel="icon" href="/favicon/favicon.ico" />
//         <link
//           rel="icon"
//           type="image/png"
//           sizes="16x16"
//           href="/favicon/favicon-16x16.png"
//         />
//         <link
//           rel="icon"
//           type="image/png"
//           sizes="32x32"
//           href="/favicon/favicon-32x32.png"
//         />
//         <link
//           rel="apple-touch-icon"
//           sizes="180x180"
//           href="/favicon/apple-touch-icon.png"
//         />

//         {/* Manifest */}
//         <link rel="manifest" href="/manifest.json" />

//         {/* Theme color */}
//         <meta name="theme-color" content="#20252e" />

//         {/* Preconnect para mejorar performance */}
//         <link rel="preconnect" href={HOST_API} />
//       </head>
//       <body>
//         <LocaleProvider>
//           <QueryProvider>
//             <AuthProvider>
//               <LocalizationProvider>
//                 <SettingsProvider defaultSettings={defaultSettings}>
//                   <ThemeProvider>
//                     <MotionLazy>
//                       <SnackbarProvider>
//                         <CheckoutProvider>
//                           <SettingsDrawer />
//                           <ProgressBar />
//                           {children}
//                         </CheckoutProvider>
//                       </SnackbarProvider>
//                     </MotionLazy>
//                   </ThemeProvider>
//                 </SettingsProvider>
//               </LocalizationProvider>
//             </AuthProvider>
//           </QueryProvider>
//         </LocaleProvider>
//       </body>
//     </html>
//   );
// }

// src/app/[lang]/layout.tsx
import { notFound } from 'next/navigation';

import { languages } from '../i18n/settings';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Validar que el idioma sea soportado
  if (!languages.includes(lang as any)) {
    notFound();
  }

  return (
    <>
      {/* Aquí puedes inyectar el idioma a tus providers si es necesario */}
      {children}
    </>
  );
}
