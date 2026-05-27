import { Metadata } from 'next';

import BlankView from '@/sections/blank/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Blank',
};

export default function BlankPage() {
  return <BlankView />;
}
