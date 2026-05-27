import { Metadata } from 'next';

import SeoPanelView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Seo',
};

export default function QrPanelPage() {
  return <SeoPanelView />;
}
