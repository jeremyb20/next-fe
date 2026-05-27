import { Metadata } from 'next';

import CarouselView from '@/sections/_examples/extra/carousel-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Carousel',
};

export default function CarouselPage() {
  return <CarouselView />;
}
