import { Metadata } from 'next';

import { FaqsView } from '@/sections/faqs/view';
import { buildStaticMetadata } from '@/utils/seo-metadata';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() === 'EN' ? 'EN' : 'ES';

  return buildStaticMetadata({
    route: '/faqs',
    language,
    title:
      language === 'EN'
        ? 'Frequently Asked Questions | PlaquitasCR Smart Pet Tags'
        : 'Preguntas Frecuentes | Placas Inteligentes para Mascotas',
    description:
      language === 'EN'
        ? 'Answers about smart pet tags, installation, digital pet profiles, privacy, shipping and payments at PlaquitasCR.'
        : 'Resuelve tus dudas sobre placas inteligentes para mascotas, instalación, perfil digital, privacidad, envíos y pagos en PlaquitasCR.',
  });
}

export default function FaqsPage() {
  return <FaqsView />;
}
