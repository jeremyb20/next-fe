import { Metadata } from 'next';

import { AboutView } from '@/sections/about/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'About us',
};

export default function AboutPage() {
  return <AboutView />;
}
