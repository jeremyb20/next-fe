import { Metadata } from 'next';

import { ShadowsView } from '@/sections/_examples/foundation';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Foundations: Shadows',
};

export default function ShadowsPage() {
  return <ShadowsView />;
}
