// import { _tours } from '@/_mock/_tour';

import { Metadata } from 'next';

import { TourDetailsView } from '@/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Tour Details',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TourDetailsPage({ params }: Props) {
  const { id } = await params;

  return <TourDetailsView id={id} />;
  // return <>TourDetailsView</>;
}

// export async function generateStaticParams() {
//   return _tours.map((tour) => ({
//     id: tour.id,
//   }));
// }
