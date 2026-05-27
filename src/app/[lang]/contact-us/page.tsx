import { Metadata } from 'next';

import { ContactView } from '@/sections/contact/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Contact us',
};

export default function ContactPage() {
  return <ContactView />;
}
