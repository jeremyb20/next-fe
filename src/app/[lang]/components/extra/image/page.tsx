import { Metadata } from 'next';

import ImageView from '@/sections/_examples/extra/image-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Image',
};

export default function ImagePage() {
  return <ImageView />;
}
