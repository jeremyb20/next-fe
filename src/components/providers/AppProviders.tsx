'use client';

import 'src/global.css';

// ----------------------------------------------------------------------

import i18next from '@/src/app/i18n/i18next';
import { I18nextProvider } from 'react-i18next';

import ClientProviders from './client-providers';

// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';
// import { AuthProvider } from 'src/auth/context/supabase';

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
