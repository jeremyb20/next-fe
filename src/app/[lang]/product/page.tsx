// ----------------------------------------------------------------------

import { Metadata } from 'next';

import { ProductShopView } from '@/sections/product/view';

export const metadata: Metadata = {
  title: 'Product: Shop',
};

export default function ShopPage() {
  return <ProductShopView />;
}
