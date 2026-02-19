'use client';

import { useCallback } from 'react';
import { languages, fallbackLng } from '@/app/i18n/settings';
import { useParams, useRouter as useNextRouter } from 'next/navigation';

export function useRouter() {
  const router = useNextRouter();
  const params = useParams();
  const currentLng = (params?.lang as string) || fallbackLng;
  const localizeHref = useCallback(
    (href: string, targetLng?: string): string => {
      if (
        href.startsWith('http') ||
        href.startsWith('/api') ||
        href.startsWith('/_next')
      ) {
        return href;
      }

      const lng = targetLng || currentLng;
      // ✅ Usar find en lugar de for...of
      const langInHref = languages.find(
        (lang) => href === `/${lang}` || href.startsWith(`/${lang}/`)
      );

      let pathWithoutLang = href;
      if (langInHref) {
        pathWithoutLang =
          href === `/${langInHref}` ? '/' : href.replace(`/${langInHref}`, '');
      }

      const cleanPath = pathWithoutLang.startsWith('/')
        ? pathWithoutLang
        : `/${pathWithoutLang}`;
      return cleanPath === '/' ? `/${lng}` : `/${lng}${cleanPath}`;
    },
    [currentLng]
  );

  const push = useCallback(
    (href: string, options?: any, targetLng?: string) => {
      router.push(localizeHref(href, targetLng), options);
    },
    [router, localizeHref]
  );

  return {
    ...router,
    push,
    replace: useCallback(
      (href: string, options?: any, targetLng?: string) => {
        router.replace(localizeHref(href, targetLng), options);
      },
      [router, localizeHref]
    ),
    currentLng,
    getLocalizedPath: localizeHref,
  };
}
