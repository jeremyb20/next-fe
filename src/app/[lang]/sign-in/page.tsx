import { Metadata } from 'next';
import { JwtLoginView } from '@/sections/auth/jwt';
import { getSeoMetadata } from '@/utils/seo-metadata';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  // Obtener el idioma de los params, asegurando que sea válido
  const lang = params?.lang?.toUpperCase() || 'ES';
  const supportedLanguages = ['ES', 'EN', 'AR', 'VI', 'ZH', 'FR'];
  const validLang = supportedLanguages.includes(lang) ? lang : 'ES';

  return getSeoMetadata('sign-in', validLang);
}

export default function LoginPage() {
  return <JwtLoginView />;
}
