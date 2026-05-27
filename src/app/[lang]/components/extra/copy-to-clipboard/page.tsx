import { Metadata } from 'next';

import CopyToClipboardView from '@/sections/_examples/extra/copy-to-clipboard-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Copy to Clipboard',
};

export default function CopyToClipboardPage() {
  return <CopyToClipboardView />;
}
