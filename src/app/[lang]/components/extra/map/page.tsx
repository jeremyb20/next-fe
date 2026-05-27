import { Metadata } from 'next';

import MapView from '@/sections/_examples/extra/map-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Map',
};

export default function MapPage() {
  return <MapView />;
}
