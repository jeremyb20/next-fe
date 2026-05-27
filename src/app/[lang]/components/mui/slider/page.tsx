import { Metadata } from 'next';

import SliderView from '@/sections/_examples/mui/slider-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Slider',
};

export default function SliderPage() {
  return <SliderView />;
}
