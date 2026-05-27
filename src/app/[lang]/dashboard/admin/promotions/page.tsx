import { Metadata } from 'next';

import QrPanelView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Promotions',
};

export default function QrPanelPage() {
  return <QrPanelView />;
}
