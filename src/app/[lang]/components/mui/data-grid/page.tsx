import { Metadata } from 'next';

import DataGridView from '@/sections/_examples/mui/data-grid-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: DataGrid',
};

export default function DataGridPage() {
  return <DataGridView />;
}
