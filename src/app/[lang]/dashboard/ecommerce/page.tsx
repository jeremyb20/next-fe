import { Metadata } from 'next';

import { OverviewEcommerceView } from '@/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: E-Commerce',
};

export default function OverviewEcommercePage() {
  return <OverviewEcommerceView />;
}
