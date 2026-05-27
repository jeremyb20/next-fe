import { Metadata } from 'next';

import RatingView from '@/sections/_examples/mui/rating-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Rating',
};

export default function RatingPage() {
  return <RatingView />;
}
