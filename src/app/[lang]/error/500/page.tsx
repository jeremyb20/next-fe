import { Metadata } from 'next';

import { View500 } from '@/sections/error';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: '500 Internal Server Error',
};

export default function Page500() {
  return <View500 />;
}
