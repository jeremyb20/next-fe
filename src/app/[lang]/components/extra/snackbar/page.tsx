import { Metadata } from 'next';

import SnackbarView from '@/sections/_examples/extra/snackbar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Snackbar',
};

export default function SnackbarPage() {
  return <SnackbarView />;
}
