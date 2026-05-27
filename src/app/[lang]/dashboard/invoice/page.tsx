import { Metadata } from 'next';

import { InvoiceListView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Invoice List',
};

export default function InvoiceListPage() {
  return <InvoiceListView />;
}
