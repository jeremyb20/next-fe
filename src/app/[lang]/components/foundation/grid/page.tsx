import { Metadata } from 'next';

import { GridView } from '@/sections/_examples/foundation';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Foundations: Grid',
};

export default function GridPage() {
  return <GridView />;
}
