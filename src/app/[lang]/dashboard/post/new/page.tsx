import { Metadata } from 'next';

import { PostCreateView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new post',
};

export default function PostCreatePage() {
  return <PostCreateView />;
}
