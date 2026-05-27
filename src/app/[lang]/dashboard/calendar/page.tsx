import { Metadata } from 'next';

import { CalendarView } from '@/sections/calendar/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Calendar',
};

export default function CalendarPage() {
  return <CalendarView />;
}
