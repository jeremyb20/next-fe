// import { paramCase } from '@/utils/change-case';
// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

import { PostDetailsView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Post Details',
};

type Props = {
  params: Promise<{
    title: string;
  }>;
};

export default async function PostDetailsPage({ params }: Props) {
  const { title } = await params;

  return <PostDetailsView title={title} />;
  // return <>PostDetailsView</>;
}
