// import { paramCase } from '@/utils/change-case';
// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

// import { PostDetailsHomeView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Post: Details',
};

type Props = {
  params: Promise<{
    title: string;
  }>;
};

export default function PostDetailsHomePage({ params: _params }: Props) {
  // const { title } = params;

  //  return <PostDetailsHomeView title={title} />;
  return <>PostDetailsHomeView</>;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }
