// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

import { ProductEditView } from '../../_components/product/view';

// import { ProductEditView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Product Edit',
};

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductEditPage({ params }: Props) {
  const { productId } = await params;

  return <ProductEditView productId={productId} />;
  // return <>ProductEditView</>;
}
// Que se use el endpoint correcto para cuando el usuario no esta loggeado

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.admin.product.list);

//   return res.data.payload.map((product: { id: string }) => ({
//     id: product.id,
//   }));
// }
