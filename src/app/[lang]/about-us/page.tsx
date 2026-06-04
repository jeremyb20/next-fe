import { Metadata } from 'next';

import { AboutView } from '@/sections/about/view';
import { getSeoMetadata } from '@/utils/seo-metadata';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata(
    'home-page-platform-about-us',
    language
  );

  return metadata;
}
export default function AboutPage() {
  return <AboutView />;
}
