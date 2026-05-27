import { Metadata } from 'next';

import TransferListView from '@/sections/_examples/mui/transfer-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Transfer List',
};

export default function TransferListPage() {
  return <TransferListView />;
}
