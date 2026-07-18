import { Metadata } from 'next';

import FeedBackAdminView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Feedback',
};

export default function FeedbackPage() {
  return <FeedBackAdminView />;
}
