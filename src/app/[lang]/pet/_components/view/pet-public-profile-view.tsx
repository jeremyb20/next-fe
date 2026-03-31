'use client';

import React from 'react';
import { IPetProfile } from '@/types/api';
import { useTranslation } from '@/hooks/use-translation';
import { SplashScreen } from '@/components/loading-screen';
import { useSettingsContext } from '@/components/settings';

import { Container } from '@mui/system';

import PetProfileViewComponent from './pet-profile-view-component';

interface Props {
  petProfile: IPetProfile | null;
  canEdit?: boolean;
}

export default function PetPublickProfileView({ petProfile, canEdit }: Props) {
  const { mounted } = useTranslation();
  const settings = useSettingsContext();

  if (!mounted) {
    return <SplashScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ py: 10 }}>
      <PetProfileViewComponent
        petProfile={petProfile!}
        isLoading={!petProfile}
        requireLocationConsent={
          petProfile?.permissions?.showLocationConsent ?? true
        }
        onLocationConsentComplete={() => {
          // Callback opcional cuando se completa el consentimiento
          console.log('Location consent completed');
        }}
        canEdit={canEdit}
      />
    </Container>
  );
}
