import { paths } from '@/routes/paths';
import { useState, useEffect, useCallback } from 'react'; // Exporta la función
import { fallbackLng } from '@/app/i18n/settings';
import { useParams, useRouter } from '@/routes/hooks';
import { SplashScreen } from '@/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const getLoginPath = (method: string, lng: string) => {
  const basePath = {
    jwt: paths.auth.jwt.login,
    auth0: paths.auth.auth0.login,
    amplify: paths.auth.amplify.login,
    firebase: paths.auth.firebase.login,
    supabase: paths.auth.supabase.login,
  }[method];

  // Si la ruta ya tiene :lng, lo reemplazamos
  if (basePath && basePath.includes('/:lng')) {
    return basePath.replace('/:lng', `/${lng}`);
  }

  // Si no tiene prefijo, se lo agregamos
  return basePath ? `/${lng}${basePath}` : `/${lng}/auth/login`;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const params = useParams();
  const lng = (params?.lang as string) || fallbackLng;

  const { authenticated, method } = useAuthContext();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      // Obtener la ruta actual para returnTo
      const currentPath = window.location.pathname;

      // Construir returnTo sin duplicar el idioma
      const returnTo = currentPath.startsWith(`/${lng}`)
        ? currentPath
        : `/${lng}${currentPath}`;

      const searchParams = new URLSearchParams({
        returnTo,
      }).toString();

      // Obtener la ruta de login localizada
      const loginPath = getLoginPath(method, lng);

      // Asegurar que no hay duplicación de idioma
      const cleanLoginPath = loginPath.replace(/\/{2,}/g, '/');

      const href = `${cleanLoginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router, lng]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
