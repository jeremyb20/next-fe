import { Metadata } from 'next';
import { HomeView } from '@/sections/home/view';
import { getSeoMetadata } from '@//utils/seo-metadata';
import { getServerLanguage } from '@//utils/get-server-language';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const language = await getServerLanguage();
  const lang = params.lang.toUpperCase() || language || 'ES';
  return getSeoMetadata('home-page-platform', lang || 'ES');
}

export default function HomePage() {
  return <HomeView />;
}
