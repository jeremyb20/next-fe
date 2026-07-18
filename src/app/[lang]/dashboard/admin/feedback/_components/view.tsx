'use client';

import React from 'react';
import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import FeedbackView from './view/feedback-view';

export default function FeedBackAdminView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <FeedbackView />
      </RoleBasedGuard>
    </Container>
  );
}
