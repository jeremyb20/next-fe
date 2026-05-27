import { Metadata } from 'next';

import { FileManagerView } from '@/sections/file-manager/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: File Manager',
};

export default function FileManagerPage() {
  return <FileManagerView />;
}
