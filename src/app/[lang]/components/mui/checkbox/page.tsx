import { Metadata } from 'next';

import CheckboxView from '@/sections/_examples/mui/checkbox-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Checkbox',
};

export default function CheckboxPage() {
  return <CheckboxView />;
}
