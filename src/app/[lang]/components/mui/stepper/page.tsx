import { Metadata } from 'next';

import StepperView from '@/sections/_examples/mui/stepper-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Stepper',
};

export default function StepperPage() {
  return <StepperView />;
}
