import { Metadata } from 'next';

import ListView from '@/sections/_examples/mui/list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: List',
};

export default function ListPage() {
  return <ListView />;
}
