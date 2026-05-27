import { Metadata } from 'next';

import { PostListView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Post List',
};

export default function PostListPage() {
  return <PostListView />;
}
