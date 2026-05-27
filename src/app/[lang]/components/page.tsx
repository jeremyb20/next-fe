import { Metadata } from 'next';

import ComponentsView from '@/sections/_examples/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components',
};

export default function ComponentsPage() {
  return <ComponentsView />;
}
