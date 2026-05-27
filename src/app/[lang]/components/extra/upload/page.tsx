import { Metadata } from 'next';

import UploadView from '@/sections/_examples/extra/upload-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Upload',
};

export default function UploadPage() {
  return <UploadView />;
}
