import { Metadata } from 'next';

import NotificationsPanelView from './_components/view';

export const metadata: Metadata = {
  title: 'Notifications',
};
// ----------------------------------------------------------------------

export default function NotificationsPage() {
  return <NotificationsPanelView />;
}
