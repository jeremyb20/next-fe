// proxy.ts
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

import { languages, cookieName, fallbackLng } from './src/app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
  ],
};

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ✅ PRIMERO: Redirigir la raíz sin idioma
  if (pathname === '/') {
    let detectedLng = fallbackLng;

    // Intentar obtener idioma de la cookie
    const cookieLng = req.cookies.get(cookieName)?.value;
    if (cookieLng && languages.includes(cookieLng as any)) {
      detectedLng = cookieLng;
    } else {
      // Usar Accept-Language del navegador
      const acceptLng = acceptLanguage.get(req.headers.get('Accept-Language'));
      if (acceptLng && languages.includes(acceptLng as any)) {
        detectedLng = acceptLng;
      }
    }

    // ✅ Redirigir 301 (permanente) a la versión con idioma
    const newUrl = new URL(`/${detectedLng}${search}`, req.url);
    const response = NextResponse.redirect(newUrl, 301);

    // Establecer cookie para futuras visitas
    response.cookies.set(cookieName, detectedLng, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });

    return response;
  }

  // ✅ SEGUNDO: Verificar si el idioma ya está en la ruta
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

  // ✅ TERCERO: Redirigir otras rutas sin idioma a la versión con idioma
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
