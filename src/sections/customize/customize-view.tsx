'use client';

import dynamic from 'next/dynamic';

const PetTagCustomize = dynamic(() => import('./PetTagCustomize'), {
  ssr: false,
});

// ----------------------------------------------------------------------

export default function CustomizeView() {
  return (
    <>
      <PetTagCustomize />
    </>
  );
}
