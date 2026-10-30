import { Metadata } from 'next';

import { getSeoMetadata } from '@/utils/seo-metadata';
import { ProductShopView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata('home-page-petshop', language);

  return metadata;
}
export default function AboutPage() {
  return <ProductShopView />;
}
