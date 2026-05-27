import { Metadata } from 'next';

import AvatarView from '@/sections/_examples/mui/avatar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Avatar',
};

export default function AvatarPage() {
  return <AvatarView />;
}
