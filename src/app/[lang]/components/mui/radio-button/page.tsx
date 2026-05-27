import { Metadata } from 'next';

import RadioButtonView from '@/sections/_examples/mui/radio-button-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Radio Button',
};

export default function RadioButtonPage() {
  return <RadioButtonView />;
}
