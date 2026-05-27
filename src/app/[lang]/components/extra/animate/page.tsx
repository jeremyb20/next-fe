import { Metadata } from 'next';

import AnimateView from '@/sections/_examples/extra/animate-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Animate',
};

export default function AnimatePage() {
  return <AnimateView />;
}
