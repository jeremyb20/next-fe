import { Metadata } from 'next';

import LightboxView from '@/sections/_examples/extra/lightbox-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Lightbox',
};

export default function LightboxPage() {
  return <LightboxView />;
}
