import { Metadata } from 'next';

import TextMaxLineView from '@/sections/_examples/extra/text-max-line-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Text Max Line',
};

export default function TextMaxLinePage() {
  return <TextMaxLineView />;
}
