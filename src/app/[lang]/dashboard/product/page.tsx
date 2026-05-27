// import { ProductListView } from '@/sections/product/view';

// // ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: Product List',
// };

// export default function ProductListPage() {
//   return <ProductListView />;
// }

import { Metadata } from 'next';

import { ProductShopView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Product List',
};

export default function ProductListPage() {
  return <ProductShopView />;
}
