import { Metadata } from 'next';

import { FaqsView } from '@/sections/faqs/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Faqs',
};

export default function FaqsPage() {
  return <FaqsView />;
}
