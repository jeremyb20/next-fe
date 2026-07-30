// // proxy.ts
// import type { NextRequest } from 'next/server';

// import { NextResponse } from 'next/server';
// import acceptLanguage from 'accept-language';

// import { languages, cookieName, fallbackLng } from './src/app/i18n/settings';

// acceptLanguage.languages(languages);

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
//   ],
// };

// export function proxy(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;

//   // ✅ PRIMERO: Redirigir la raíz sin idioma
//   if (pathname === '/') {
//     let detectedLng = fallbackLng;

//     // Intentar obtener idioma de la cookie
//     const cookieLng = req.cookies.get(cookieName)?.value;
//     if (cookieLng && languages.includes(cookieLng as any)) {
//       detectedLng = cookieLng;
//     } else {
//       // Usar Accept-Language del navegador
//       const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
//       if (acceptLng && languages.includes(acceptLng as any)) {
//         detectedLng = acceptLng;
//       }
//     }

//     // ✅ Redirigir 301 (permanente) a la versión con idioma
//     const newUrl = new URL(`/${detectedLng}${search}`, req.url);
//     const response = NextResponse.redirect(newUrl, 301);

//     // Establecer cookie para futuras visitas
//     response.cookies.set(cookieName, detectedLng, {
//       path: '/',
//       maxAge: 60 * 60 * 24 * 30,
//       sameSite: 'lax',
//     });

//     return response;
//   }

//   // ✅ SEGUNDO: Verificar si el idioma ya está en la ruta
//   const lngInPath = languages.find(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   if (lngInPath) {
//     const response = NextResponse.next();
//     response.cookies.set(cookieName, lngInPath, {
//       path: '/',
//       maxAge: 60 * 60 * 24 * 30,
//       sameSite: 'lax',
//     });
//     return response;
//   }

//   // ✅ TERCERO: Redirigir otras rutas sin idioma a la versión con idioma
//   let detectedLng = fallbackLng;
//   const cookieLng = req.cookies.get(cookieName)?.value;
//   if (cookieLng && languages.includes(cookieLng as any)) {
//     detectedLng = cookieLng;
//   } else {
//     const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
//     if (acceptLng && languages.includes(acceptLng as any)) {
//       detectedLng = acceptLng;
//     }
//   }

//   const newUrl = new URL(`/${detectedLng}${pathname}${search}`, req.url);

//   const response = NextResponse.redirect(newUrl, 301);
//   response.cookies.set(cookieName, detectedLng, {
//     path: '/',
//     maxAge: 60 * 60 * 24 * 30,
//     sameSite: 'lax',
//   });

//   return response;
// }

// proxy.ts
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

import { languages, cookieName, fallbackLng } from './src/app/i18n/settings';

acceptLanguage.languages(languages);

// Configuración de rutas excluidas (para AdSense y recursos estáticos)
const EXCLUDED_PATHS = [
  'api',
  '_next/static',
  '_next/image',
  'assets',
  'favicon.ico',
  'sw.js',
  'site.webmanifest',
  'pagead2.googlesyndication.com',
  'googleads',
  'doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
  'googleapis.com',
  'adsbygoogle',
];

const STATIC_FILE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'ico',
  'css',
  'js',
  'json',
  'xml',
  'txt',
  'pdf',
];

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|adsbygoogle|googleads|doubleclick\\.net|google-analytics\\.com|googletagmanager\\.com|googleapis\\.com|pagead2\\.googlesyndication\\.com|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|json|xml|txt|pdf)$).*)',
  ],
};

// ✅ Exportación CORRECTA: función llamada "proxy"
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = req.url;

  // Verificar exclusiones por seguridad
  const isExcluded = EXCLUDED_PATHS.some((path) => url.includes(path));
  const isStaticFile = STATIC_FILE_EXTENSIONS.some((ext) =>
    pathname.endsWith(`.${ext}`)
  );

  if (isExcluded || isStaticFile) {
    return NextResponse.next();
  }

  // Redirección de idioma (tu lógica existente)
  if (pathname === '/') {
    let detectedLng = fallbackLng;
    const cookieLng = req.cookies.get(cookieName)?.value;
    if (cookieLng && languages.includes(cookieLng as any)) {
      detectedLng = cookieLng;
    } else {
      const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
      if (acceptLng && languages.includes(acceptLng as any)) {
        detectedLng = acceptLng;
      }
    }

    const newUrl = new URL(`/${detectedLng}${search}`, req.url);
    const response = NextResponse.redirect(newUrl, 301);
    response.cookies.set(cookieName, detectedLng, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    return response;
  }

  const lngInPath = languages.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (lngInPath) {
    const response = NextResponse.next();
    response.cookies.set(cookieName, lngInPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    return response;
  }

  let detectedLng = fallbackLng;
  const cookieLng = req.cookies.get(cookieName)?.value;
  if (cookieLng && languages.includes(cookieLng as any)) {
    detectedLng = cookieLng;
  } else {
    const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
    if (acceptLng && languages.includes(acceptLng as any)) {
      detectedLng = acceptLng;
    }
  }

  const newUrl = new URL(`/${detectedLng}${pathname}${search}`, req.url);
  const response = NextResponse.redirect(newUrl, 301);
  response.cookies.set(cookieName, detectedLng, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}
