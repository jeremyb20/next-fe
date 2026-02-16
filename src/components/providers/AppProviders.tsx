'use client';

import '@/global.css';

// ----------------------------------------------------------------------

import i18next from '@//app/i18n/i18next';
import { I18nextProvider } from 'react-i18next';

import ClientProviders from './client-providers';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <I18nextProvider i18n={i18next}>
      <ClientProviders>{children}</ClientProviders>
    </I18nextProvider>
  );
}
