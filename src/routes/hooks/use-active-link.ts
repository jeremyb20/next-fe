// import { usePathname } from 'next/navigation';

// // ----------------------------------------------------------------------

// type ReturnType = boolean;

// export function useActiveLink(path: string, deep = true): ReturnType {
//   const pathname = usePathname();

//   const checkPath = path.startsWith('#');

//   const currentPath = path === '/' ? '/' : `${path}/`;

//   const normalActive = !checkPath && pathname === currentPath;

//   const deepActive = !checkPath && pathname.includes(currentPath);

//   return deep ? deepActive : normalActive;
// }

import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();

  const checkPath = path.startsWith('#');

  // Normalizar el path para comparación
  const normalizePath = (p: string) => {
    if (p === '/') return '/';
    // Remover trailing slash si existe para consistencia
    return p.endsWith('/') ? p.slice(0, -1) : p;
  };

  const normalizedPath = normalizePath(path);
  const normalizedPathname = normalizePath(pathname);

  const currentPath = normalizedPath === '/' ? '/' : normalizedPath;

  const normalActive = !checkPath && normalizedPathname === currentPath;

  // Para deep active, comparar paths normalizados
  const deepActive =
    !checkPath &&
    (currentPath === '/'
      ? normalizedPathname === '/'
      : normalizedPathname.startsWith(currentPath));

  return deep ? deepActive : normalActive;
}
