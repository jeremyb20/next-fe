import { Metadata } from 'next';

import ScrollProgressView from '@/sections/_examples/extra/scroll-progress-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Scroll Progress',
};

export default function ScrollProgressPage() {
  return <ScrollProgressView />;
}
