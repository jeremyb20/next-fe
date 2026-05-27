import { Metadata } from 'next';

import ButtonView from '@/sections/_examples/mui/button-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Button',
};

export default function ButtonPage() {
  return <ButtonView />;
}
