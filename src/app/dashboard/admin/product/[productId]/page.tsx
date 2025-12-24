// import axios, { endpoints } from '@/src/utils/axios';

import { paths } from '@/src/routes/paths';

import { ProductDetailsView } from '../_components/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Details',
};

type Props = {
  params: {
    productId: string;
  };
};

export default function ProductDetailsPage({ params }: Props) {
  const { productId } = params;

  return (
    <ProductDetailsView
      productId={productId}
      backLink={paths.dashboard.admin.product.root}
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
