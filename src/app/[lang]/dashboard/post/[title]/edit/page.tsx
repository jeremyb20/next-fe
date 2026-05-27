// import { paramCase } from '@/utils/change-case';
// import axios, { endpoints } from '@/utils/axios';

import { Metadata } from 'next';

// import { PostEditView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Post Edit',
};

type Props = {
  params: {
    title: string;
  };
};

export default function PostEditPage({ params: _params }: Props) {
  // const { title } = params;

  // return <PostEditView title={title} />;
  return <>PostEditView</>;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.post.list);

//   return res.data.posts.map((post: { title: string }) => ({
//     title: paramCase(post.title),
//   }));
// }
