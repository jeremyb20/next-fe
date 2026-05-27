import { Metadata } from 'next';

import { KanbanView } from '@/sections/kanban/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Kanban',
};

export default function KanbanPage() {
  return <KanbanView />;
}
