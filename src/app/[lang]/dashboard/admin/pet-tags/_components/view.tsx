'use client';

import React from 'react';
import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import PetTagView from './view/pet-tag-view';

export default function PetTagAdminView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <PetTagView />
      </RoleBasedGuard>
    </Container>
  );
}
