import { Metadata } from 'next';

import CatalogView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Catalogo',
};

export default function CatalogPage() {
  return <CatalogView />;
}
