import { Metadata } from 'next';

import PickerView from '@/sections/_examples/mui/picker-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Picker',
};

export default function PickerPage() {
  return <PickerView />;
}
