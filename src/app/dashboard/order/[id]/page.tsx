import { Metadata } from 'next';

import { _orders } from 'src/_mock/_order';

import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  console.log('***************params****************', params);
  return {
    title: 'Dashboard: Order Details',
    description:
      'The most minimal ui library for react -- then start your project by including minimal components.',
  };
}
type Props = {
  params: {
    id: string;
  };
};

export default function OrderDetailsPage({ params }: Props) {
  const { id } = params;

  return <OrderDetailsView id={id} />;
}

export async function generateStaticParams() {
  return _orders.map((order) => ({
    id: order.id,
  }));
}
