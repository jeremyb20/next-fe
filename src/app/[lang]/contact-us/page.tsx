import { Metadata } from 'next';

import { ContactView } from '@/sections/contact/view';
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
    'home-page-platform-contact-us',
    language
  );

  return metadata;
}

export default function ContactPage() {
  return <ContactView />;
}
