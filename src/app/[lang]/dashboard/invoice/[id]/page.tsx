import { Metadata } from 'next';

import { InvoiceDetailsView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Invoice Details',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvoiceDetailsPage({ params }: Props) {
  const { id } = await params;

  return <InvoiceDetailsView id={id} />;
}

// // export async function generateStaticParams() {
// //   return _invoices.map((invoice) => ({
// //     id: invoice.id,
// //   }));
// // }
