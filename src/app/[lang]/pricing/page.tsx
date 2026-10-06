import { Metadata } from 'next';

import PricingView from '@/sections/pricing/view';
import { buildStaticMetadata } from '@/utils/seo-metadata';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() === 'EN' ? 'EN' : 'ES';

  return buildStaticMetadata({
    route: '/pricing',
    language,
    title:
      language === 'EN' ? 'Plans and Pricing | PlaquitasCR' : 'Planes y Precios | PlaquitasCR',
    description:
      language === 'EN'
        ? "Explore PlaquitasCR plans to create your pet's digital profile and activate their smart tag."
        : 'Conoce los planes de PlaquitasCR para crear el perfil digital de tu mascota y activar su placa inteligente.',
  });
}

export default function PricingPage() {
  return <PricingView />;
}
