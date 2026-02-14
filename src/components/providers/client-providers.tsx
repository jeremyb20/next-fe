'use client';

import ThemeProvider from 'src/theme';
import { LocalizationProvider } from 'src/locales';
import { AuthProvider } from 'src/auth/context/jwt';
import QueryProvider from 'src/query/query-provider';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

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
