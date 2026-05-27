import { Metadata } from 'next';

import ComingSoonView from '@/sections/coming-soon/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Coming Soon',
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
