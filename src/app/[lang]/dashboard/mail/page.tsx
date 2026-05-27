import { Metadata } from 'next';

import { MailView } from '@/sections/mail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Mail',
};

export default function MailPage() {
  return <MailView />;
}
