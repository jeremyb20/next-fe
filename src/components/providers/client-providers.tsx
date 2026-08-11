'use client';

import ThemeProvider from '@/theme';
import { LocalizationProvider } from '@/locales';
import { AuthProvider } from '@/auth/context/jwt';
import QueryProvider from '@/query/query-provider';
import ProgressBar from '@/components/progress-bar';
import { MotionLazy } from '@/components/animate/motion-lazy';
import { CheckoutProvider } from '@/sections/checkout/context';
import SnackbarProvider from '@/components/snackbar/snackbar-provider';
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from '@/components/settings';

import MessengerChatWidget from '../adds/MessengerChat';

type Props = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
  return (
    <QueryProvider>
      <AuthProvider>
        <LocalizationProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <CheckoutProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    {children}
                    <MessengerChatWidget />
                  </CheckoutProvider>
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
