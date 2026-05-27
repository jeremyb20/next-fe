import { Metadata } from 'next';

import { ProductCreateView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new product',
};

export default function ProductCreatePage() {
  return <ProductCreateView />;
}
