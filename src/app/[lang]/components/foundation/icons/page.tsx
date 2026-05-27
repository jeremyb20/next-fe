import { Metadata } from 'next';

import { IconsView } from '@/sections/_examples/foundation';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Foundations: Icons',
};

export default function IconsPage() {
  return <IconsView />;
}
