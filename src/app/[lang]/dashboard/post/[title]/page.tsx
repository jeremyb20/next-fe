// import { paramCase } from '@/utils/change-case';
// import axios, { endpoints } from '@/utils/axios';

import { PostDetailsView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Post Details',
};

type Props = {
  params: {
    title: string;
  };
};

export default function PostDetailsPage({ params }: Props) {
  const { title } = params;

  return <PostDetailsView title={title} />;
  // return <>PostDetailsView</>;
}
