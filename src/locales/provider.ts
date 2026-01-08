'use client';

import { ReactNode } from 'react';

import './i18n'; // This imports your i18n setup

interface LocaleProviderProps {
  children: ReactNode;
}

export default function LocaleProvider({ children }: LocaleProviderProps) {
  // No need to return I18nextProvider as your i18n.js already uses initReactI18next
  return children;
}
