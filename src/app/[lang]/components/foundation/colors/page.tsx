import { Metadata } from 'next';

import { ColorsView } from '@/sections/_examples/foundation';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Foundations: Colors',
};

export default function ColorsPage() {
  return <ColorsView />;
}
