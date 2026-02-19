import { Metadata } from 'next';
import { ContactView } from '@/sections/contact/view';
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

  return getSeoMetadata('home-page-platform-contact-us', validLang);
}

export default function ContactPage() {
  return <ContactView />;
}
