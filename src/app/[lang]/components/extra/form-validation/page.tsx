import { Metadata } from 'next';

import FormValidationView from '@/sections/_examples/extra/form-validation-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Form Validation',
};

export default function FormValidationPage() {
  return <FormValidationView />;
}
