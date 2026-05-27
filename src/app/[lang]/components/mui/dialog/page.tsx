import { Metadata } from 'next';

import DialogView from '@/sections/_examples/mui/dialog-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Dialog',
};

export default function DialogPage() {
  return <DialogView />;
}
