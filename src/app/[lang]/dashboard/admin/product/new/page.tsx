// ----------------------------------------------------------------------

import { Metadata } from 'next';

import { ProductCreateView } from '../_components/product/view';

export const metadata: Metadata = {
  title: 'Dashboard Admin: Create a new product',
};

export default function ProductCreatePage() {
  return <ProductCreateView />;
}
