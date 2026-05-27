// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

import { paths } from '@/routes/paths';

import { ProductDetailsView } from '../../dashboard/admin/product/_components/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Product Details',
};

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { productId } = await params;

  return (
    <ProductDetailsView
      productId={productId}
      backLink={paths.dashboard.petsmarket.root}
    />
  );
  // return <>ProductDetailsView</>;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.product.list);

//   return res.data.products.map((product: { id: string }) => ({
//     id: product.id,
//   }));
// }
