// import axios, { endpoints } from '@/src/utils/axios';

import { ProductEditView } from '../../_components/product/view';

// import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductEditPage({ params }: Props) {
  const { id } = params;

  return <ProductEditView id={id} />;
  // return <>ProductEditView</>;
}
// Que se use el endpoint correcto para cuando el usuario no esta loggeado

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.admin.product.list);

//   return res.data.payload.map((product: { id: string }) => ({
//     id: product.id,
//   }));
// }
