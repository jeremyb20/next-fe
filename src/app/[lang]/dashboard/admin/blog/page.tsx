import { Metadata } from 'next';

import BlogPanelView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Blog',
};

export default function QrPanelPage() {
  return <BlogPanelView />;
}
