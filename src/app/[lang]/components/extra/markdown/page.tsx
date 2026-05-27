import { Metadata } from 'next';

import MarkdownView from '@/sections/_examples/extra/markdown-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Markdown',
};

export default function MarkdownPage() {
  return <MarkdownView />;
}
