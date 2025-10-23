import { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

import { getSeoMetadata } from '../utils/seo-metadata';
import { getServerLanguage } from '../utils/get-server-language';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const language = await getServerLanguage();

  console.log(language, 'language');
  return getSeoMetadata('home-page-platform', language || 'ES');
}

export default function HomePage() {
  return <HomeView />;
}
