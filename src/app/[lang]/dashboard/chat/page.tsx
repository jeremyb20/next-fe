import { Metadata } from 'next';

import { ChatView } from '@/sections/chat/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Chat',
};

export default function ChatPage() {
  return <ChatView />;
}
