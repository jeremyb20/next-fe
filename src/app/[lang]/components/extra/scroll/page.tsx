import { Metadata } from 'next';

import ScrollView from '@/sections/_examples/extra/scroll-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Scroll',
};

export default function ScrollPage() {
  return <ScrollView />;
}
