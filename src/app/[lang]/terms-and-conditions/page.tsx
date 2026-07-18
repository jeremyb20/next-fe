import { Metadata } from 'next';

import { getSeoMetadata } from '@/utils/seo-metadata';

import TermsAndConditions from './_components/terms-and-conditions-view';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata('terms-and-conditions', language);

  return metadata;
}
export default function Page() {
  return <TermsAndConditions />;
}
