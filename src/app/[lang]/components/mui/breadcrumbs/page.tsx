import { Metadata } from 'next';

import BreadcrumbsView from '@/sections/_examples/mui/breadcrumbs-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Breadcrumbs',
};

export default function BreadcrumbsPage() {
  return <BreadcrumbsView />;
}
