import { Metadata } from 'next';

import PaginationView from '@/sections/_examples/mui/pagination-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Pagination',
};

export default function PaginationPage() {
  return <PaginationView />;
}
