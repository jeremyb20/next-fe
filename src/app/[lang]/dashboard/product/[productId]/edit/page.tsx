// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

// import { ProductEditView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Product Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductEditPage({ params: _params }: Props) {
  //  const { id } = params;

  // return <ProductEditView id={id} />;
  return <>ProductEditView</>;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.product.list);

//   return res.data.products.map((product: { id: string }) => ({
//     id: product.id,
//   }));
// }
