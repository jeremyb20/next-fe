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

// middleware.ts (renombra proxy.ts a middleware.ts para seguir convención de Next.js)
// middleware.ts (renombra proxy.ts a middleware.ts)
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

import { languages, cookieName, fallbackLng } from './src/app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (assets folder)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - site.webmanifest (manifest file)
     * - adsbygoogle (AdSense)
     * - googleads (Google Ads)
     * - doubleclick.net (DoubleClick)
     * - google-analytics.com (Analytics)
     * - googletagmanager.com (GTM)
     * - googleapis.com (Google APIs)
     * - pagead2.googlesyndication.com (AdSense)
     * - .png, .jpg, .jpeg, .gif, .webp, .svg, .ico, .css, .js, .json, .xml, .txt, .pdf (static files)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|adsbygoogle|googleads|doubleclick\\.net|google-analytics\\.com|googletagmanager\\.com|googleapis\\.com|pagead2\\.googlesyndication\\.com|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|json|xml|txt|pdf)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = req.url;

  // Verificar si es una ruta excluida (para seguridad adicional)
  const excludedPatterns = [
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

  const isExcluded = excludedPatterns.some((path) => url.includes(path));
  const staticExtensions = [
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
  const isStaticFile = staticExtensions.some((ext) =>
    pathname.endsWith(`.${ext}`)
  );

  if (isExcluded || isStaticFile) {
    return NextResponse.next();
  }

  // ✅ PRIMERO: Redirigir la raíz sin idioma
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

  // Verificar si el idioma ya está en la ruta
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

  // Detectar idioma
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

  // Redirigir a la versión con idioma
  const newUrl = new URL(`/${detectedLng}${pathname}${search}`, req.url);
  const response = NextResponse.redirect(newUrl, 301);
  response.cookies.set(cookieName, detectedLng, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}
