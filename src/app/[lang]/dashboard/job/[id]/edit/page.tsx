// import { _jobs } from '@/_mock/_job';

import { Metadata } from 'next';

// import { JobEditView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Job Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobEditPage({ params: _params }: Props) {
  //  const { id } = params;

  // return <JobEditView id={id} />;
  return <>JobEditView</>;
}

// export async function generateStaticParams() {
//   return _jobs.map((job) => ({
//     id: job.id,
//   }));
// }
