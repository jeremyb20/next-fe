import { Metadata } from 'next';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  console.log('***************params****************', params);
  return {
    title: 'Dashboard order list',
    description:
      'The most minimal ui library for react -- then start your project by including minimal components.',
  };
}

export default function OrderListPage() {
  return <OrderListView />;
}
