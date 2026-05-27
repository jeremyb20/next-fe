import { Metadata } from 'next';

import AutocompleteView from '@/sections/_examples/mui/autocomplete-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Autocomplete',
};

export default function AutocompletePage() {
  return <AutocompleteView />;
}
