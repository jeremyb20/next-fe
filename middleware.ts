// import acceptLanguage from 'accept-language';
// import { NextRequest, NextResponse } from 'next/server';

// import {
//   languages,
//   cookieName,
//   headerName,
//   fallbackLng,
// } from './src/app/i18n/settings';

// acceptLanguage.languages(languages);

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
//   ],
// };

// export function middleware(req: NextRequest) {
//   // 1. Ignorar archivos estáticos y recursos
//   if (
//     req.nextUrl.pathname.includes('/icon') ||
//     req.nextUrl.pathname.includes('/chrome') ||
//     req.nextUrl.pathname.includes('/_next') ||
//     req.nextUrl.pathname.includes('/api')
//   ) {
//     return NextResponse.next();
//   }

//   // 2. Determinar el idioma preferido
//   let lng: string | null = null;

//   // Verificar cookie
//   if (req.cookies.has(cookieName)) {
//     const cookieValue = req.cookies.get(cookieName)?.value;
//     lng = acceptLanguage.get(cookieValue);
//   }

//   // Verificar header Accept-Language
//   if (!lng) {
//     lng = acceptLanguage.get(req.headers.get('Accept-Language'));
//   }

//   // Usar fallback
//   if (!lng) {
//     lng = fallbackLng;
//   }

//   // 3. Verificar si el idioma ya está en la ruta
//   const { pathname } = req.nextUrl;
//   const lngInPath = languages.find(
//     (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
//   );

//   // 4. Configurar headers
//   const headers = new Headers(req.headers);
//   headers.set(headerName, lngInPath || lng);

//   // 5. REDIRECCIÓN: Solo si no hay idioma en la ruta
//   if (!lngInPath) {
//     // Evitar redirigir si ya estamos en una ruta con idioma
//     // o si es una ruta especial
//     const isSpecialPath =
//       pathname.startsWith('/_next') ||
//       pathname.startsWith('/api') ||
//       pathname.includes('.') || // Archivos con extensión
//       pathname === '/favicon.ico';

//     if (!isSpecialPath) {
//       // Construir nueva URL con el idioma
//       const newUrl = new URL(
//         `/${lng}${pathname}${req.nextUrl.search}`,
//         req.url
//       );

//       // Evitar bucles de redirección
//       if (pathname !== newUrl.pathname) {
//         console.log(`🌐 Redirigiendo: ${pathname} → ${newUrl.pathname}`);
//         return NextResponse.redirect(newUrl);
//       }
//     }
//   }

//   // 6. Manejar cookie basada en referer
//   const response = NextResponse.next({ headers });

//   if (req.headers.has('referer')) {
//     try {
//       const refererUrl = new URL(req.headers.get('referer') || '');
//       const lngInReferer = languages.find(
//         (l) =>
//           refererUrl.pathname.startsWith(`/${l}/`) ||
//           refererUrl.pathname === `/${l}`
//       );

//       if (lngInReferer && lngInReferer !== lngInPath) {
//         response.cookies.set(cookieName, lngInReferer);
//       }
//     } catch (error) {
//       // URL inválida, ignorar
//     }
//   } else {
//     // Establecer cookie con el idioma actual
//     response.cookies.set(cookieName, lngInPath || lng);
//   }

//   return response;
// }

import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import type { NextRequest } from 'next/server';

import { languages, cookieName, fallbackLng } from './src/app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Verificar si la ruta YA TIENE un idioma válido
  const lngInPath = languages.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 2. Si YA tiene idioma en la ruta, NO redirigir, solo continuar
  if (lngInPath) {
    // Actualizar cookie silenciosamente
    const response = NextResponse.next();
    response.cookies.set(cookieName, lngInPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      sameSite: 'lax',
    });
    return response;
  }

  // 3. NO tiene idioma en la ruta → Detectar idioma preferido
  let detectedLng = fallbackLng;

  // 3.1 Buscar en cookie
  const cookieLng = req.cookies.get(cookieName)?.value;
  if (cookieLng && languages.includes(cookieLng as any)) {
    detectedLng = cookieLng;
  } else {
    // 3.2 Buscar en Accept-Language
    const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
    if (acceptLng && languages.includes(acceptLng as any)) {
      detectedLng = acceptLng;
    }
  }

  // 4. Redirigir a la misma ruta pero con el idioma detectado
  const newUrl = new URL(
    `/${detectedLng}${pathname}${req.nextUrl.search}`,
    req.url
  );

  const response = NextResponse.redirect(newUrl);
  response.cookies.set(cookieName, detectedLng, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}
