import { Metadata } from 'next';

import { getSeoMetadata } from '@/utils/seo-metadata';
import { FeedbackView } from '@/sections/feedback/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata('feedback', language);

  return metadata;
}

export default function Page() {
  return <FeedbackView />;
}
