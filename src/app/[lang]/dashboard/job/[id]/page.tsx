// import { _jobs } from '@/_mock/_job';

import { JobDetailsView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Job Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobDetailsPage({ params }: Props) {
  const { id } = params;

  return <JobDetailsView id={id} />;
  // return <>JobDetailsView</>;
}

// export async function generateStaticParams() {
//   return _jobs.map((job) => ({
//     id: job.id,
//   }));
// }
