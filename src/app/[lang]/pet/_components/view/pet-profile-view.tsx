/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */

'use client';

import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { fDate } from '@/utils/format-time';
import React, { useRef, useState, useEffect } from 'react';
// Importaciones de react-share

import Image from '@/components/image';
import { paths } from '@/routes/paths';
import { EMAIL_SUPPORT } from '@/config-global';
import axios, { endpoints } from '@/utils/axios';
import { RouterLink } from '@/routes/components';
// import { useTranslation } from 'react-i18next';
import { BreedOptions } from '@/utils/constants';
import { AvatarShape } from '@/assets/illustrations';
import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';
import { useSettingsContext } from '@/components/settings';
import CardComponent from '@/sections/_examples/card-component';
import SplashScreen from '@/components/loading-screen/splash-screen';
import CostaRicaIDCard from '@/components/country-cards/Costa-Rica/costa-rica-card';

import {
  Box,
  Tab,
  Card,
  Grid,
  Chip,
  Tabs,
  Stack,
  alpha,
  Alert,
  Paper,
  Avatar,
  Dialog,
  Button,
  Divider,
  Tooltip,
  useTheme,
  Snackbar,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  ListItemText,
  useMediaQuery,
  DialogContent,
  SwipeableDrawer,
  CircularProgress,
} from '@mui/material';

import PetStickyNote from './pet-sticky-note';
import ShareButtons from '../share/share-buttons';
import MedicalControlView from './medical-control-view';
import LocationConsentOverlay from '../locations/location-consent-overlay';

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
  const [openImage, setOpenImage] = useState(false);
  const settings = useSettingsContext();
  const { t, mounted } = useTranslation();
  const { user } = useManagerUser();
  const [locationConsent, setLocationConsent] = useState<
    'pending' | 'accepted' | 'rejected' | 'error'
  >('pending');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const consentRequestedRef = useRef(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

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

  const registerPetViewWithLocation = async (position: GeolocationPosition) => {
    if (!petProfile?.memberPetId) return;

    setIsLoadingLocation(true);
    try {
      const { latitude, longitude } = position.coords;
      if (!canEdit)
        // Registrar la vista en el backend
        await axios.post(
          `${endpoints.user.registerPetView}/${petProfile.memberPetId}`,
          {
            lat: latitude,
            lng: longitude,
          }
        );

      // Marcar como aceptado en sessionStorage
      sessionStorage.setItem(`pet_view_${petProfile.memberPetId}`, 'true');
      setLocationConsent('accepted');

      // Mostrar confirmación
      setSnackbar({
        open: true,
        message: 'Location shared successfully! Pet view recorded.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error recording location:', error);
      setLocationConsent('error');
      setSnackbar({
        open: true,
        message: 'Error recording location. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsLoadingLocation(false);
    }
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

  useEffect(() => {
    if (!petProfile?.memberPetId) return;

    const hasRecordedLocation = sessionStorage.getItem(
      `pet_view_${petProfile.memberPetId}`
    );

    if (hasRecordedLocation === 'true') {
      setLocationConsent('accepted');
    } else if (!consentRequestedRef.current) {
      consentRequestedRef.current = true;
      // No hacer nada, el overlay se mostrará automáticamente
    }
  }, [petProfile?.memberPetId]);

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
  const MAIL_SUBJECT = encodeURIComponent(
    'Solicitud de activación de cédula digital para mascota'
  );
  const MAIL_BODY = encodeURIComponent(
    'Hola,\n\n' +
      'Me gustaría activar la cédula digital para mi mascota. Por favor, indíquenme los pasos a seguir.\n\n' +
      'Datos de mi mascota:\n' +
      '- Nombre: \n' +
      '- Número de identificación: \n\n' +
      'Quedo atento a sus indicaciones.\n\n' +
      'Saludos cordiales.'
  );
  const mailtoHref = `mailto:${EMAIL_SUPPORT}?subject=${MAIL_SUBJECT}&body=${MAIL_BODY}`;

  if (!mounted) {
    return <SplashScreen />; // Placeholder durante SSR
  }

  return (
    <>
      {/* Overlay de consentimiento - bloquea completamente el contenido */}
      <LocationConsentOverlay
        isVisible={locationConsent === 'pending'}
        onLocationAccepted={registerPetViewWithLocation}
        petName={petProfile?.petName || 'this pet'}
      />

      {/* Contenido principal - solo visible si la ubicación fue aceptada */}
      {locationConsent === 'accepted' && (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Stack
            spacing={3}
            direction="row"
            justifyContent="flex-start"
            mt={10}
          >
            {user._id && (
              <Button
                component={RouterLink}
                href={paths.dashboard.user.pets}
                startIcon={
                  <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                }
              >
                {t('Back')}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
          </Stack>

          <Grid container spacing={0} pb={4}>
            <Grid item xs={12} md={4}>
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
                      onClick={() => setOpenImage(true)}
                      sx={{
                        width: 100,
                        height: 100,
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
                      {/* <IconButton
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
                      </IconButton> */}

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
                      ratio="6/4"
                      overlay={alpha(theme.palette.grey[900], 0.48)}
                    />
                  </Box>
                  <ListItemText
                    sx={{ mt: 7, mb: 1 }}
                    primary={petProfile.petName}
                    secondary={`${fDate(petProfile.birthDate)} ( ${
                      age.years
                    } ${t('years')} ${
                      age.months > 0 && `${age.months} ${t('months')} )`
                    } • ID:
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
                      {petProfile.petViewCounter?.length || 0}
                    </div>
                  </Box>
                  {petProfile.notes && (
                    <Box sx={{ py: 4 }}>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ mb: 0.5, color: 'text.secondary' }}
                      >
                        {t('Notes')}
                      </Typography>
                      <PetStickyNote
                        notes={petProfile.notes}
                        color={
                          petProfile.petStatus === 'active' ? 'yellow' : 'red'
                        }
                        editable={canEdit}
                        onNoteChange={(newNotes) => {
                          // Aquí puedes implementar la lógica para guardar los cambios
                          console.log('Note updated:', newNotes);
                        }}
                      />
                    </Box>
                  )}
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* Tabs Section */}
              <Box sx={{ p: 2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
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
                      // ...(petProfile.isDigitalIdentificationActive
                      //   ? [
                      //       {
                      //         id: 2,
                      //         value: 'digitalCard',
                      //         label: 'Digital Card',
                      //         icon: 'solar:card-outline',
                      //       },
                      //     ]
                      //   : []),

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
                                      (breed) =>
                                        breed.value === petProfile?.breed
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
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
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
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                    >
                                      {t('Digital Identification')}
                                    </Typography>

                                    {/* Tooltip con ícono de pregunta */}
                                    <Tooltip
                                      title={
                                        <span>
                                          ¿Quieres activar la cédula digital?
                                          Escríbenos a{' '}
                                          <a
                                            href={mailtoHref}
                                            style={{
                                              color: '#1976d2',
                                              textDecoration: 'underline',
                                              fontWeight: 500,
                                              cursor: 'pointer',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {EMAIL_SUPPORT}
                                          </a>{' '}
                                          y te guiaremos en el proceso paso a
                                          paso. 🐾
                                        </span>
                                      }
                                      arrow
                                      placement="top"
                                      enterTouchDelay={0}
                                      leaveTouchDelay={3000}
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: 'background.paper',
                                            color: 'text.primary',
                                            boxShadow: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            fontSize: '0.875rem',
                                            p: 1,
                                            maxWidth: 250,
                                          },
                                        },
                                        arrow: {
                                          sx: {
                                            color: 'background.paper',
                                            '&:before': {
                                              border: '1px solid',
                                              borderColor: 'divider',
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        sx={{
                                          p: 0.5,
                                          color: 'text.secondary',
                                          '&:hover': {
                                            color: 'primary.main',
                                            backgroundColor: 'transparent',
                                          },
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Iconify
                                          icon="mdi:help-circle-outline"
                                          width={18}
                                          height={18}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>

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
                                      <Typography
                                        variant="body1"
                                        fontWeight={600}
                                      >
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
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      {petProfile.petViewCounter?.length || 0}
                                    </Typography>
                                  </Box>
                                </Stack>
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
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
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
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
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
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
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
                                    {fDate(petProfile.createdAt)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardComponent>

                            {/* Veterinarian Information */}
                            {(canShowVeterinarianContact ||
                              canShowPhoneVeterinarian) && (
                              <CardComponent
                                title={t('Veterinary Information')}
                              >
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
                                        {petProfile.veterinarianContact ||
                                          'N/A'}
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
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>

                  {/* Gallery Tab */}
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
                  {/* <TabPanel value={tabValue} index={2}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CostaRicaIDCard data={petProfile} />
                    </Box>
                  </TabPanel> */}

                  {/* Medical Control Tab */}
                  <TabPanel value={tabValue} index={2}>
                    <Box px={1}>
                      <MedicalControlView
                        currentPet={petProfile}
                        memberPetId={petProfile?.memberPetId || ''}
                      />
                    </Box>
                  </TabPanel>

                  {/* Followers Tab */}
                  <TabPanel value={tabValue} index={4}>
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
                {petProfile.isDigitalIdentificationActive && (
                  <Stack justifyContent="center">
                    <CostaRicaIDCard data={petProfile} />
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}

      {/* Indicador de carga mientras se procesa la ubicación */}
      {isLoadingLocation && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1">Recording your location...</Typography>
          </Paper>
        </Box>
      )}

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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

      {/* Dialog para imagen ampliada */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            p: 1,
          }}
        >
          <IconButton onClick={() => setOpenImage(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Avatar
            alt={petProfile.petName}
            src={petProfile.photo}
            sx={{
              width: isMobile ? 200 : 300,
              height: isMobile ? 200 : 300,
              objectFit: 'cover',
              mx: 'auto',
              mb: 2,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
