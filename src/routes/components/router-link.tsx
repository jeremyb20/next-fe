// import { forwardRef } from 'react';
// import Link, { LinkProps } from 'next/link';
// import { fallbackLng } from '@/src/app/i18n/settings';
// import { localStorageGetItem } from '@/src/utils/storage-available';

// // ----------------------------------------------------------------------

// interface RouterLinkProps extends LinkProps {
//   lng?: string;
//   href: string;
//   children?: React.ReactNode;
// }

// const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
//   ({ lng = fallbackLng, href, children, ...other }, ref) => {
//     // Construir la URL con el idioma
//     const langStorage = localStorageGetItem('i18nextLng');

//     const localizedHref = `/${langStorage || fallbackLng}${
//       href.startsWith('/') ? href : `/${href}`
//     }`;

//     return (
//       <Link ref={ref} href={localizedHref} {...other}>
//         {children}
//       </Link>
//     );
//   }
// );

// RouterLink.displayName = 'RouterLink';

// export default RouterLink;

// src/routes/components/router-link.tsx

'use client';

import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { fallbackLng } from '@/src/app/i18n/settings';

// ----------------------------------------------------------------------

interface RouterLinkProps extends LinkProps {
  href: string;
  children?: React.ReactNode;
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, children, ...other }, ref) => {
    const params = useParams();
    // Usar el idioma de la URL como fuente de verdad (más confiable)
    const currentLng = (params?.lang as string) || fallbackLng;

    // Construir la URL con el idioma actual
    const localizedHref = (() => {
      if (typeof href !== 'string' || href.startsWith('http')) {
        return href;
      }

      // Si ya tiene el idioma, mantenerlo
      if (href.startsWith(`/${currentLng}/`) || href === `/${currentLng}`) {
        return href;
      }

      const cleanHref = href.startsWith('/') ? href : `/${href}`;
      return `/${currentLng}${cleanHref}`;
    })();

    return (
      <Link ref={ref} href={localizedHref} {...other}>
        {children}
      </Link>
    );
  }
);

RouterLink.displayName = 'RouterLink';

export default RouterLink;
