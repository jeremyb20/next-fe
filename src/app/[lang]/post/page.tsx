import { Metadata } from 'next';

import { PostListHomeView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Post: List',
};

export default function PostListHomePage() {
  return <PostListHomeView />;
}
