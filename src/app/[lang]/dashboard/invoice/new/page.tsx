import { Metadata } from 'next';

import { InvoiceCreateView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new invoice',
};

export default function InvoiceCreatePage() {
  return <InvoiceCreateView />;
}
