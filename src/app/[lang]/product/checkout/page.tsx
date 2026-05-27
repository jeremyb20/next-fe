import { Metadata } from 'next';

import { CheckoutView } from '@/sections/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
