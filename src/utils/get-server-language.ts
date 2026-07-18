// src/utils/get-server-language.ts
import { cookies, headers } from 'next/headers';

export async function getServerLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Obtener idioma de la cookie
  const i18nCookie = cookieStore.get('i18nextLng');

  // Obtener idioma del navegador
  const acceptLanguage = headersList.get('accept-language');
  const browserLang = acceptLanguage?.split(',')[0]?.split('-')[0] || 'es';

  // Usar cookie si existe, o el idioma del navegador
  const rawLanguage = i18nCookie?.value || browserLang;

  // ✅ Retornar en minúsculas y solo el primer código (ej: 'es' en lugar de 'es-ES')
  return rawLanguage.split('-')[0].toLowerCase(); // Cambiar toUpperCase() por toLowerCase()
}
