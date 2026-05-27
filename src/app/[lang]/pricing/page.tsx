import { Metadata } from 'next';

import PricingView from '@/sections/pricing/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Pricing',
};

export default function PricingPage() {
  return <PricingView />;
}
