import { Metadata } from 'next';

import EditorView from '@/sections/_examples/extra/editor-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Editor',
};

export default function EditorPage() {
  return <EditorView />;
}
