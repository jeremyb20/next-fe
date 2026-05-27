import { Metadata } from 'next';

import WalktourView from '@/sections/_examples/extra/walktour-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Walktour',
};

export default function WalktourPage() {
  return <WalktourView />;
}
