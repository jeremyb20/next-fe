import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { fallbackLng } from '@/src/app/i18n/settings';

// ----------------------------------------------------------------------

interface RouterLinkProps extends LinkProps {
  lng?: string;
  href: string;
  children?: React.ReactNode;
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ lng = fallbackLng, href, children, ...other }, ref) => {
    // Construir la URL con el idioma
    const localizedHref = `/${lng}${href.startsWith('/') ? href : `/${href}`}`;

    return (
      <Link ref={ref} href={localizedHref} {...other}>
        {children}
      </Link>
    );
  }
);

RouterLink.displayName = 'RouterLink';

export default RouterLink;
