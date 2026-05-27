import { Metadata } from 'next';

import PetsMarketView from './_view/petsmarket-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Pets Market List',
};

export default function PetsMarketPage() {
  return <PetsMarketView />;
}
