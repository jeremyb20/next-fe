// ----------------------------------------------------------------------

import { Metadata } from 'next';

import ProductView from './_components/view';

export const metadata: Metadata = {
  title: 'Admin Catalogo',
};

export default function CatalogPage() {
  return <ProductView />;
}
