'use client';

import { useState } from 'react';
import Iconify from '@/components/iconify';
import { PetApiResponse } from '@/types/global';
import { useTranslation } from '@/hooks/use-translation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
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
  const { t } = useTranslation();
  const handleBackToSelection = () => {
    setRegistrationType(null);
  };

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: registrationType === null ? 580 : 480,
        px: { xs: 2 },
      }}
    >
      <Card
        sx={{
          py: { xs: 3, md: 5 },
          px: 3,
          boxShadow: 'none',
          bgcolor: 'background.default',
          overflow: 'unset',
          my: 8,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {registrationType !== null && (
            <Button
              onClick={handleBackToSelection}
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              {t('Back to selection')}
            </Button>
          )}
        </Stack>
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
