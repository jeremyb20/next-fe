import { Metadata } from 'next';

import MultiLanguageView from '@/sections/_examples/extra/multi-language-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Multi Language',
};

export default function MultiLanguagePage() {
  return <MultiLanguageView />;
}
