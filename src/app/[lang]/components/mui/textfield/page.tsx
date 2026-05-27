import { Metadata } from 'next';

import TextfieldView from '@/sections/_examples/mui/textfield-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: TextField',
};

export default function TextfieldPage() {
  return <TextfieldView />;
}
