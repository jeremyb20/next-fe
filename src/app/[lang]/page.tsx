import { Metadata } from 'next';
import { getSeoMetadata } from '@/src/utils/seo-metadata';
import { getServerLanguage } from '@/src/utils/get-server-language';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const language = await getServerLanguage();

  return getSeoMetadata('home-page-platform', language || 'ES');
}

export default function HomePage() {
  return <HomeView />;
}
