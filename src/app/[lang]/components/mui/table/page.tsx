import { Metadata } from 'next';

import TableView from '@/sections/_examples/mui/table-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Table',
};

export default function TablePage() {
  return <TableView />;
}
