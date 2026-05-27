// import { _jobs } from '@/_mock/_job';

import { Metadata } from 'next';

import { JobDetailsView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Job Details',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;

  return <JobDetailsView id={id} />;
  // return <>JobDetailsView</>;
}

// export async function generateStaticParams() {
//   return _jobs.map((job) => ({
//     id: job.id,
//   }));
// }
