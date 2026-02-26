import { usePathname } from 'next/navigation';

import { useRouter } from './use-router'; // Ajusta la ruta según tu estructura

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();
  const { getLocalizedPath, currentLng } = useRouter();

  const checkPath = path.startsWith('#');

  // Normalizar el path para comparación
  const normalizePath = (p: string) => {
    if (p === '/') return '/';
    // Remover trailing slash si existe para consistencia
    return p.endsWith('/') ? p.slice(0, -1) : p;
  };

  // Obtener la versión localizada del path actual y del path a comparar
  const localizedCurrentPath = normalizePath(pathname);

  // Para el path objetivo, obtener su versión localizada con el idioma actual
  const localizedTargetPath = normalizePath(getLocalizedPath(path, currentLng));

  // También necesitamos comparar sin el prefijo de idioma para rutas dinámicas
  const pathWithoutLang = (p: string) => {
    const langPrefix = `/${currentLng}`;
    if (p.startsWith(langPrefix)) {
      const withoutLang = p.slice(langPrefix.length);
      return withoutLang || '/';
    }
    return p;
  };

  const targetPathWithoutLang = normalizePath(path);
  const currentPathWithoutLang = pathWithoutLang(localizedCurrentPath);

  // Comparación exacta con prefijo de idioma
  const normalActive =
    !checkPath && localizedCurrentPath === localizedTargetPath;

  // Comparación exacta sin prefijo de idioma (útil para links sin idioma)
  const normalActiveWithoutLang =
    !checkPath && currentPathWithoutLang === targetPathWithoutLang;

  // Deep active con prefijo de idioma
  const deepActive =
    !checkPath &&
    (localizedTargetPath === '/'
      ? localizedCurrentPath === '/'
      : localizedCurrentPath.startsWith(`${localizedTargetPath}/`));

  // Deep active sin prefijo de idioma
  const deepActiveWithoutLang =
    !checkPath &&
    (targetPathWithoutLang === '/'
      ? currentPathWithoutLang === '/'
      : currentPathWithoutLang.startsWith(`${targetPathWithoutLang}/`));

  // Si deep es true, usar deepActive, si no, normalActive
  // También considerar las comparaciones sin idioma como fallback
  if (deep) {
    return deepActive || deepActiveWithoutLang;
  }

  return normalActive || normalActiveWithoutLang;
}
