import { Metadata } from 'next';

import { HomeView } from '@/sections/home/view';
import { getSeoMetadata } from '@/utils/seo-metadata';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>; // ← Cambio 1: Promise
}): Promise<Metadata> {
  // Cambio 2: await params antes de acceder
  const { lang: langParam } = await params;

  // Obtener el idioma de los params, asegurando que sea válido
  const lang = langParam?.toUpperCase() || 'ES';
  const supportedLanguages = ['ES', 'EN', 'AR', 'VI', 'ZH', 'FR'];
  const validLang = supportedLanguages.includes(lang) ? lang : 'ES';

  return getSeoMetadata('home-page-platform', validLang);
}

export default function HomePage() {
  return <HomeView />;
}
