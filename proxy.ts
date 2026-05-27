// proxy.ts (antes middleware.ts)
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

// ✅ Solo cambia el nombre de la función
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // El resto del código NO CAMBIA
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