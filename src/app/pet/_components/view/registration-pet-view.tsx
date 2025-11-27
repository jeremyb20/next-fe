'use client';

import { useState } from 'react';
import Logo from '@/src/components/logo';
import { PetApiResponse } from '@/src/types/global';
import { useResponsive } from '@/src/hooks/use-responsive';
import SettingsButton from '@/src/layouts/common/settings-button';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { RegistrationTypeSelector } from '../cards/registration-type-selector';
import { PetRegistrationExistingUser } from '../forms/pet-registration-existing-user';
import PetRegistrationCodeStepperFirstTime from '../forms/pet-registration-code-stepper-first-time';

// ----------------------------------------------------------------------

export default function RegistrationPetView({
  registerPet,
}: {
  registerPet: PetApiResponse;
}) {
  const [registrationType, setRegistrationType] = useState<
    'new' | 'existing' | null
  >(null);

  const handleBackToSelection = () => {
    setRegistrationType(null);
  };
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: registrationType === null ? 580 : 480,
        px: { xs: 2 },
      }}
    >
      {mdUp && (
        <Logo
          sx={{
            mt: 8,
            mb: 8,
          }}
        />
      )}
      <Card
        sx={{
          py: { xs: 3, md: 5 },
          px: 3,
          boxShadow: 'none',
          bgcolor: 'background.default',
          overflow: 'unset',
          my: 3,
        }}
      >
        {' '}
        {!mdUp && <Logo sx={{ mb: 2 }} />}
        <SettingsButton
          sx={{
            ml: { xs: 1, md: 0 },
            mr: { md: 2 },
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        />
        {registrationType === null && (
          <RegistrationTypeSelector onSelect={setRegistrationType} />
        )}
        {registrationType === 'new' && (
          <PetRegistrationCodeStepperFirstTime
            code={registerPet?.qrCode?.randomCode}
            onBackToSelection={handleBackToSelection}
          />
        )}
        {registrationType === 'existing' && (
          <PetRegistrationExistingUser
            code={registerPet?.qrCode?.randomCode}
            onBackToSelection={handleBackToSelection}
          />
        )}
      </Card>
    </Stack>
  );

  const renderSection = (
    <Stack sx={{ position: 'relative' }}>
      <Box
        component="img"
        alt="auth"
        src="/assets/background/overlay_3.jpg"
        sx={{
          top: 16,
          left: 16,
          objectFit: 'cover',
          position: 'absolute',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 32px)',
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'absolute',
          backgroundSize: 'cover',
          // opacity: { xs: 0.24, md: 0 },
          opacity: 0.24,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'url(/assets/background/overlay_4.jpg)',
        },
      }}
    >
      {renderContent}

      {renderSection}
    </Stack>
  );
}
