import { useRef, useEffect, useCallback } from 'react';

import { IChatMessage } from '@/types/chat';

// ----------------------------------------------------------------------

export default function useMessagesScroll(messages: IChatMessage[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollMessagesToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages]);

  return {
    messagesEndRef,
  };
}
