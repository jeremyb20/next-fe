// import { _invoices } from '@/_mock/_invoice';

import { Metadata } from 'next';

// import { InvoiceEditView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Invoice Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function InvoiceEditPage({ params: _params }: Props) {
  // const { id } = params;

  // return <InvoiceEditView id={id} />;
  return <>InvoiceEditView</>;
}

// export async function generateStaticParams() {
//   return _invoices.map((invoice) => ({
//     id: invoice.id,
//   }));
// }
