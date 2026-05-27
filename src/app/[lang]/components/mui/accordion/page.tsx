import { Metadata } from 'next';

import AccordionView from '@/sections/_examples/mui/accordion-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Accordion',
};

export default function AccordionPage() {
  return <AccordionView />;
}
