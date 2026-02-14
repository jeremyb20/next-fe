import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

import {
  languages,
  cookieName,
  headerName,
  fallbackLng,
} from './src/app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};

export function middleware(req: NextRequest) {
  // 1. Ignorar archivos estáticos y recursos
  if (
    req.nextUrl.pathname.includes('/icon') ||
    req.nextUrl.pathname.includes('/chrome') ||
    req.nextUrl.pathname.includes('/_next') ||
    req.nextUrl.pathname.includes('/api')
  ) {
    return NextResponse.next();
  }

  // 2. Determinar el idioma preferido
  let lng: string | null = null;

  // Verificar cookie
  if (req.cookies.has(cookieName)) {
    const cookieValue = req.cookies.get(cookieName)?.value;
    lng = acceptLanguage.get(cookieValue);
  }

  // Verificar header Accept-Language
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }

  // Usar fallback
  if (!lng) {
    lng = fallbackLng;
  }

  // 3. Verificar si el idioma ya está en la ruta
  const { pathname } = req.nextUrl;
  const lngInPath = languages.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // 4. Configurar headers
  const headers = new Headers(req.headers);
  headers.set(headerName, lngInPath || lng);

  // 5. REDIRECCIÓN: Solo si no hay idioma en la ruta
  if (!lngInPath) {
    // Evitar redirigir si ya estamos en una ruta con idioma
    // o si es una ruta especial
    const isSpecialPath =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') || // Archivos con extensión
      pathname === '/favicon.ico';

    if (!isSpecialPath) {
      // Construir nueva URL con el idioma
      const newUrl = new URL(
        `/${lng}${pathname}${req.nextUrl.search}`,
        req.url
      );

      // Evitar bucles de redirección
      if (pathname !== newUrl.pathname) {
        console.log(`🌐 Redirigiendo: ${pathname} → ${newUrl.pathname}`);
        return NextResponse.redirect(newUrl);
      }
    }
  }

  // 6. Manejar cookie basada en referer
  const response = NextResponse.next({ headers });

  if (req.headers.has('referer')) {
    try {
      const refererUrl = new URL(req.headers.get('referer') || '');
      const lngInReferer = languages.find(
        (l) =>
          refererUrl.pathname.startsWith(`/${l}/`) ||
          refererUrl.pathname === `/${l}`
      );

      if (lngInReferer && lngInReferer !== lngInPath) {
        response.cookies.set(cookieName, lngInReferer);
      }
    } catch (error) {
      // URL inválida, ignorar
    }
  } else {
    // Establecer cookie con el idioma actual
    response.cookies.set(cookieName, lngInPath || lng);
  }

  return response;
}
