/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */

'use client';

import React, { useState } from 'react';
import { IPetProfile } from '@/src/types/api';
import Iconify from '@/src/components/iconify';
import { fDate } from '@/src/utils/format-time';
// Importaciones de react-share

import { paths } from '@/src/routes/paths';
import { useTranslation } from 'react-i18next';
import { BreedOptions } from '@/src/utils/constants';
import { AvatarShape } from '@/src/assets/illustrations';
import { useSettingsContext } from '@/src/components/settings';
import CardComponent from '@/src/sections/_examples/card-component';

import {
  Box,
  Tab,
  Card,
  Grid,
  Chip,
  Tabs,
  Stack,
  alpha,
  Avatar,
  Dialog,
  Button,
  Divider,
  useTheme,
  Container,
  Typography,
  IconButton,
  ListItemText,
  useMediaQuery,
  SwipeableDrawer,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import Image from 'src/components/image';

import ShareButtons from '../share/share-buttons';
import MedicalControlView from './medical-control-view';

interface Props {
  petProfile: IPetProfile | null;
  canEdit?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pet-tabpanel-${index}`}
      aria-labelledby={`pet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PetProfileView({ petProfile, canEdit }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const settings = useSettingsContext();
  const { t } = useTranslation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleShareOpen = () => {
    setShareOpen(true);
  };

  const handleShareClose = () => {
    setShareOpen(false);
  };

  // Datos para compartir
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${t('View the profile of')} ${
    petProfile?.petName || t('this pet')
  }`;
  const shareDescription = `${t('Meet')} ${petProfile?.petName}, ${t(
    'a pet who needs your attention.'
  )}`;

  // Función para calcular la edad
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  };

  // Verificar permisos
  const canShowPhoneInfo = petProfile?.permissions?.showPhoneInfo ?? true;
  const canShowOwnerPetName = petProfile?.permissions?.showOwnerPetName ?? true;
  const canShowBirthDate = petProfile?.permissions?.showBirthDate ?? true;
  const canShowAddressInfo = petProfile?.permissions?.showAddressInfo ?? true;
  const canShowLocationInfo = petProfile?.permissions?.showLocationInfo ?? true;
  const canShowVeterinarianContact =
    petProfile?.permissions?.showVeterinarianContact ?? true;
  const canShowPhoneVeterinarian =
    petProfile?.permissions?.showPhoneVeterinarian ?? true;
  const canShowHealthAndRequirements =
    petProfile?.permissions?.showHealthAndRequirements ?? true;
  const canShowFavoriteActivities =
    petProfile?.permissions?.showFavoriteActivities ?? true;

  // Si no hay datos de mascota
  if (!petProfile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          padding: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('No information was found about the pet.')}
        </Typography>
      </Box>
    );
  }

  const age = calculateAge(petProfile.birthDate);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3} direction="row" justifyContent="flex-start" mb={3}>
          <Button
            component={RouterLink}
            href={paths.dashboard.user.myPets}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          >
            {t('Back')}
          </Button>
          <Box sx={{ flexGrow: 1 }} />
        </Stack>
        <Grid container spacing={0}>
          <Grid xs={12} md={4}>
            {/* Header Section */}
            <Box sx={{ p: 2 }}>
              <Card sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                  <AvatarShape
                    sx={{
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      mx: 'auto',
                      bottom: -26,
                      position: 'absolute',
                    }}
                  />

                  <Avatar
                    alt={petProfile.petName}
                    src={petProfile.photo}
                    sx={{
                      width: 64,
                      height: 64,
                      zIndex: 11,
                      left: 0,
                      right: 0,
                      bottom: -32,
                      mx: 'auto',
                      position: 'absolute',
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignSelf: { xs: 'flex-start', sm: 'flex-end' },
                      mt: { xs: 1, sm: 0 },
                      position: 'absolute',
                      zIndex: 20,
                      right: 10,
                      bottom: 10,
                    }}
                  >
                    <IconButton
                      sx={{
                        backgroundColor: '#2a3745',
                        color: 'white',
                        width: { xs: 40, sm: 44, md: 48 },
                        height: { xs: 40, sm: 44, md: 48 },
                        '&:hover': {
                          backgroundColor: '#25303b',
                        },
                      }}
                    >
                      <Iconify
                        icon="material-symbols:favorite"
                        width={{ xs: 20, sm: 22, md: 24 }}
                      />
                    </IconButton>

                    <IconButton
                      onClick={handleShareOpen}
                      sx={{
                        backgroundColor: '#2a3745',
                        color: 'white',
                        width: { xs: 40, sm: 44, md: 48 },
                        height: { xs: 40, sm: 44, md: 48 },
                        '&:hover': {
                          backgroundColor: '#25303b',
                        },
                      }}
                    >
                      <Iconify
                        icon="solar:share-bold"
                        width={{ xs: 20, sm: 22, md: 24 }}
                      />
                    </IconButton>
                  </Stack>

                  <Image
                    src={petProfile.photo}
                    alt={petProfile.photo}
                    ratio="16/9"
                    overlay={alpha(theme.palette.grey[900], 0.48)}
                  />
                </Box>

                <ListItemText
                  sx={{ mt: 7, mb: 1 }}
                  primary={petProfile.petName}
                  secondary={`${fDate(petProfile.birthDate)} ( ${age.years} ${t(
                    'years'
                  )} ${age.months > 0 && `${age.months} ${t('months')} )`} • ID:
                  ${petProfile.memberPetId}`}
                  primaryTypographyProps={{ typography: 'subtitle1' }}
                  secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
                />

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  sx={{ py: 3, typography: 'subtitle1' }}
                >
                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ mb: 0.5, color: 'text.secondary' }}
                    >
                      {t('Joined')}
                    </Typography>
                    {fDate(petProfile.createdAt) || 'N/A'}
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ mb: 0.5, color: 'text.secondary' }}
                    >
                      {t('Updated at')}
                    </Typography>
                    {fDate(petProfile.updatedAt) || 'N/A'}
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ mb: 0.5, color: 'text.secondary' }}
                    >
                      {t('Total Views')}
                    </Typography>
                    {petProfile.petViewCounter.length}
                  </div>
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid xs={12} md={8}>
            {/* Tabs Section */}
            <Box sx={{ p: 2 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                {/* <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? 'scrollable' : 'fullWidth'}
                  scrollButtons="auto"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      minHeight: 60,
                    },
                  }}
                >
                  <Tab
                    icon={<Iconify icon="solar:user-rounded-linear" />}
                    iconPosition="start"
                    label="Información"
                  />
                  <Tab
                    icon={<Iconify icon="solar:gallery-linear" />}
                    iconPosition="start"
                    label="Galería"
                  />
                  
                </Tabs> */}

                <Tabs
                  variant="fullWidth"
                  value={tabValue}
                  onChange={handleTabChange}
                >
                  {[
                    {
                      id: 0,
                      value: 'information',
                      label: 'Information',
                      icon: 'solar:user-rounded-linear',
                    },
                    {
                      id: 1,
                      value: 'galery',
                      label: 'Galery',
                      icon: 'solar:gallery-linear',
                    },
                    ...(canEdit
                      ? [
                          {
                            id: 2,
                            value: 'medicalControl',
                            label: 'Medical Control',
                            icon: 'hugeicons:injection',
                          },
                        ]
                      : []),
                  ].map((tab) => (
                    <Tab
                      iconPosition="start"
                      key={tab.value}
                      icon={<Iconify icon={tab.icon} />}
                      label={t(tab.label)}
                      value={tab.id}
                    />
                  ))}
                </Tabs>

                {/* Information Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ px: isMobile ? 2 : 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                          {/* Basic Information */}
                          <CardComponent title={t('Basic Information')}>
                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Pet Name')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {petProfile.petName}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Gender')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {t(petProfile.genderSelected) || 'N/A'}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Breed')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {BreedOptions.todos.find(
                                    (breed) => breed.value === petProfile?.breed
                                  )?.label || 'Unknown breed'}
                                </Typography>
                              </Box>

                              {/* Fecha de nacimiento - controlada por permisos */}
                              {canShowBirthDate && petProfile.birthDate && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    {t('Age')}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {age.years} {t('years')}{' '}
                                    {age.months > 0 &&
                                      `${age.months} ${t('months')}`}
                                  </Typography>
                                </Box>
                              )}

                              {/* Actividades favoritas - controladas por permisos */}
                              {canShowFavoriteActivities &&
                                petProfile.favoriteActivities && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}
                                    >
                                      {t('Favorite Activities')}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      {petProfile.favoriteActivities}
                                    </Typography>
                                  </Box>
                                )}

                              {/* Requisitos de salud - controlados por permisos */}
                              {canShowHealthAndRequirements &&
                                petProfile.healthAndRequirements && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}
                                    >
                                      {t('Health & Requirements')}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      {petProfile.healthAndRequirements}
                                    </Typography>
                                  </Box>
                                )}
                            </Stack>
                          </CardComponent>

                          {/* Status Information */}
                          <CardComponent title={t('Status Information')}>
                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Current Status')}
                                </Typography>
                                <Chip
                                  label={petProfile.petStatus}
                                  size="small"
                                  sx={{ textTransform: 'capitalize' }}
                                  color={
                                    petProfile.petStatus === 'Perdido'
                                      ? 'error'
                                      : petProfile.petStatus === 'Encontrado'
                                        ? 'success'
                                        : 'primary'
                                  }
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Digital Identification')}
                                </Typography>
                                <Chip
                                  label={
                                    petProfile.isDigitalIdentificationActive
                                      ? 'Activa'
                                      : 'Inactiva'
                                  }
                                  size="small"
                                  color={
                                    petProfile.isDigitalIdentificationActive
                                      ? 'success'
                                      : 'default'
                                  }
                                />
                              </Box>
                            </Stack>
                          </CardComponent>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                          {/* Owner Information */}
                          <CardComponent title={t('Owner Information')}>
                            <Stack spacing={2} sx={{ pb: 2 }}>
                              {/* Nombre del propietario - controlado por permisos */}
                              {canShowOwnerPetName && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    {t('Owner Name')}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {petProfile.ownerPetName || 'N/A'}
                                  </Typography>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Country')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {petProfile.owner?.country
                                    ? petProfile.owner?.country
                                    : 'N/A'}
                                </Typography>
                              </Box>

                              {/* Teléfono - controlado por permisos */}
                              {canShowPhoneInfo && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    {t('Phone Number')}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {petProfile.phone || 'N/A'}
                                  </Typography>
                                </Box>
                              )}

                              {/* Dirección - controlada por permisos */}
                              {canShowAddressInfo && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    {t('Address')}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {petProfile.address || 'N/A'}
                                  </Typography>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Pet Id')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  #{petProfile.memberPetId}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Registration Date')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {/* {new Date(
                                    petProfile.createdAt
                                  ).toLocaleDateString('es-ES')} */}
                                  {fDate(petProfile.createdAt)}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardComponent>

                          {/* Veterinarian Information */}
                          {(canShowVeterinarianContact ||
                            canShowPhoneVeterinarian) && (
                            <CardComponent title={t('Veterinary Information')}>
                              <Stack spacing={2}>
                                {/* Contacto del veterinario - controlado por permisos */}
                                {canShowVeterinarianContact && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                    >
                                      {t('Veterinarian')}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      {petProfile.veterinarianContact || 'N/A'}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Teléfono del veterinario - controlado por permisos */}
                                {canShowPhoneVeterinarian && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                    >
                                      {t('Veterinary Phone Number')}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      {petProfile.phoneVeterinarian || 'N/A'}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </CardComponent>
                          )}

                          {/* Activity Information */}

                          <CardComponent title={t('Activity Information')}>
                            <Stack spacing={2}>
                              {canShowLocationInfo && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    {t('Profile Views')}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {petProfile.petViewCounter?.length || 0}
                                  </Typography>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {t('Registered Locations')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {petProfile.petViewCounter?.length || 0}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardComponent>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>

                {/* Resto de los TabPanels... */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Iconify
                      icon="solar:gallery-linear"
                      sx={{ fontSize: 64, color: '#ccc', mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      {t('Gallery')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {t('Here you will see photos of')} {petProfile.petName}
                    </Typography>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Box px={1}>
                    <MedicalControlView currentPet={petProfile} />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Iconify
                      icon="solar:heart-linear"
                      sx={{ fontSize: 64, color: '#ccc', mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      {t('Followers')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {t('Here you will see the followers of')}{' '}
                      {petProfile.petName}
                    </Typography>
                  </Box>
                </TabPanel>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Modal de Compartir para Desktop */}
      {!isMobile && (
        <Dialog
          open={shareOpen}
          onClose={handleShareClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <ShareButtons
            shareUrl={shareUrl}
            shareTitle={shareTitle}
            shareDescription={shareDescription}
            petProfile={petProfile || ''}
            isMobile={isMobile}
            onClose={handleShareClose}
          />
        </Dialog>
      )}

      {/* Drawer de Compartir para Mobile */}
      {isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={shareOpen}
          onClose={handleShareClose}
          onOpen={() => {}}
          sx={{
            '& .MuiDrawer-paper': {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '80vh',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              py: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                backgroundColor: 'grey.300',
                borderRadius: 2,
              }}
            />
          </Box>
          <ShareButtons
            shareUrl={shareUrl}
            shareTitle={shareTitle}
            shareDescription={shareDescription}
            petProfile={petProfile || ''}
            isMobile={isMobile}
            onClose={handleShareClose}
          />
        </SwipeableDrawer>
      )}
    </>
  );
}
