/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */

'use client';

import Image from '@/components/image';
import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { fDate } from '@/utils/format-time';
import { RouterLink } from '@/routes/components';
import { BreedOptions } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useGetPetProfileById } from '@/hooks/use-fetch';
import { useSettingsContext } from '@/components/settings';
import SplashScreen from '@/components/loading-screen/splash-screen';
import { DOMAIN, EMAIL_SUPPORT, PHONE_SUPPORT } from '@/config-global';
import PetStickyNote from '@/app/[lang]/pet/_components/view/pet-sticky-note';
import CostaRicaIDCard from '@/components/country-cards/Costa-Rica/costa-rica-card';
import PetLocationMap from '@/app/[lang]/pet/_components/locations/pet-location-map';

import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  alpha,
  Alert,
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
  useMediaQuery,
  SwipeableDrawer,
} from '@mui/material';

import ShareButtons from '../../../pet/_components/share/share-buttons';

interface Props {
  petId: string;
  canEdit?: boolean;
}

export default function PetProfileView({ petId, canEdit }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [shareOpen, setShareOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const settings = useSettingsContext();
  const { t, lng: currentLang } = useTranslation();
  const { data: petProfile, isFetching } = useGetPetProfileById(petId);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [petLocation, setPetLocation] = useState({
    lat: '',
    lng: '',
    address: '',
  });

  const handleShareOpen = () => {
    setShareOpen(true);
  };

  const handleShareClose = () => {
    setShareOpen(false);
  };

  // Datos para compartir
  const shareUrl = `${DOMAIN}/${currentLang}/pet/${petId}`;
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

  useEffect(() => {
    if (petProfile) {
      setPetLocation({
        lat: petProfile.lat || '',
        lng: petProfile.lng || '',
        address: petProfile.address || '',
      });
    }
  }, [petProfile]);

  if (isFetching) {
    return <SplashScreen />;
  }
  // Si no hay datos de mascota
  if (!petProfile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          padding: 3,
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('No information was found about the pet.')}
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.user.pets}
          variant="contained"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="h4" fontWeight={700}>
            {t('Back')}
          </Typography>
        </Button>
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ pb: 4 }}>
        {/* Botón de retroceso */}
        <Button
          component={RouterLink}
          href={paths.dashboard.user.pets}
          sx={{ mb: 0.5 }}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={26} />}
        >
          <Typography variant="h4" fontWeight={700}>
            {t('Pet profile')}
          </Typography>
        </Button>

        <Grid container spacing={3}>
          {/* Columna izquierda - Foto e información básica */}
          <Grid item xs={12} md={5}>
            {/* Perfil de la mascota */}
            <Card sx={{ textAlign: 'left', overflow: 'hidden' }}>
              {/* Imagen de portada (banner) */}
              <Box
                sx={{
                  position: 'relative',
                  height: {
                    xs: 200,
                    md: 300,
                  },
                }}
              >
                <Image
                  src={petProfile.photo || petProfile.photo}
                  alt={petProfile.petName}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  overlay={alpha(theme.palette.grey[900], 0.48)}
                />
                <IconButton
                  onClick={handleShareOpen}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                    },
                    zIndex: 2,
                  }}
                >
                  <Iconify icon="solar:share-bold" width={20} />
                </IconButton>
              </Box>

              {/* Contenedor principal con avatar e información */}
              <Box sx={{ px: 1.5, pb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mt: -3 }}>
                  {/* Avatar a la izquierda */}
                  <Avatar
                    alt={petProfile.petName}
                    src={petProfile.photo}
                    onClick={() => setOpenImage(true)}
                    sx={{
                      width: 110,
                      height: 110,
                      cursor: 'pointer',
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: 2,
                      zIndex: 10,
                    }}
                  />

                  {/* Información a la derecha */}
                  <Box sx={{ flex: 1, pt: 5 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {petProfile.petName}
                      </Typography>
                      <Chip
                        label={petProfile.petStatus}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 100 }}
                        color={
                          petProfile.petStatus === 'Perdido'
                            ? 'error'
                            : petProfile.petStatus === 'Encontrado'
                              ? 'success'
                              : 'primary'
                        }
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      spacing={0.5}
                      alignItems="flex-start"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Iconify
                          icon="mdi:cake-variant"
                          width={13}
                          sx={{ color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {fDate(petProfile.birthDate)} ({age.years}{' '}
                          {t('years')}{' '}
                          {age.months > 0 && `${age.months} ${t('months')}`})
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Iconify
                          icon="mdi:dog"
                          width={13}
                          sx={{ color: 'text.secondary' }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {BreedOptions.todos.find(
                              (breed) => breed.value === petProfile?.breed
                            )?.label || 'Unknown breed'}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Box>

                {/* Métricas: Joined, Updated at, Total Views */}
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  sx={{ typography: 'subtitle1', mt: 2 }}
                >
                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        mb: 0.5,
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="mdi:calendar-plus" width={14} />
                      {t('Joined')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {fDate(petProfile.createdAt) || 'N/A'}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        mb: 0.5,
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="mdi:calendar-edit" width={14} />
                      {t('Updated at')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {fDate(petProfile.updatedAt) || 'N/A'}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        mb: 0.5,
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="mdi:eye" width={14} />
                      {t('Total Views')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {petProfile.petViewCounter?.length || 0}
                    </Typography>
                  </div>
                </Box>

                {/* Notes section */}
                {petProfile.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{
                        mb: 1,
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="mdi:note-text" width={16} />
                      {t('Notes')}
                    </Typography>
                    <PetStickyNote
                      notes={petProfile.notes}
                      color={
                        petProfile.petStatus === 'active' ? 'yellow' : 'red'
                      }
                      editable={canEdit}
                      onNoteChange={(newNotes) => {
                        console.log('Note updated:', newNotes);
                      }}
                    />
                  </Box>
                )}
                <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

                {/* Información de la mascota */}
                <Box sx={{ pt: 2, pb: 3, px: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    {t('Basic Information')}
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Columna izquierda */}
                    <Grid item xs={6} sm={6}>
                      <Stack spacing={2.5}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:paw"
                            width={20}
                            height={20}
                            sx={{ color: 'text.secondary', mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t('Pet Name')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {petProfile.petName}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Iconify
                            icon={
                              petProfile.genderSelected === 'Male'
                                ? 'mdi:gender-male'
                                : 'mdi:gender-female'
                            }
                            width={20}
                            height={20}
                            sx={{ color: 'text.secondary', mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t('Gender')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {t(petProfile.genderSelected) || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Favorite Activities - antes de Status */}
                        {canShowFavoriteActivities &&
                          petProfile.favoriteActivities && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Iconify
                                icon="mdi:heart"
                                width={20}
                                height={20}
                                sx={{ color: 'text.secondary', mt: 0.5 }}
                              />
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {t('Favorite Activities')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {petProfile.favoriteActivities}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                        {/* Status - al final de la columna izquierda */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:alert-circle-outline"
                            width={20}
                            height={20}
                            sx={{ color: 'text.secondary', mt: 0.5 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t('Status')}
                            </Typography>
                            <Chip
                              label={petProfile.petStatus}
                              size="small"
                              sx={{
                                mt: 0.5,
                                textTransform: 'capitalize',
                                fontWeight: 500,
                              }}
                              color={
                                petProfile.petStatus === 'Perdido'
                                  ? 'error'
                                  : petProfile.petStatus === 'Encontrado'
                                    ? 'success'
                                    : 'primary'
                              }
                              icon={
                                <Iconify
                                  icon={
                                    petProfile.petStatus === 'Perdido'
                                      ? 'mdi:alert'
                                      : petProfile.petStatus === 'Encontrado'
                                        ? 'mdi:check-circle'
                                        : 'mdi:information'
                                  }
                                  width={16}
                                  height={16}
                                />
                              }
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Columna derecha */}
                    <Grid item xs={6} sm={6}>
                      <Stack spacing={2.5}>
                        {canShowBirthDate && petProfile.birthDate && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5,
                            }}
                          >
                            <Iconify
                              icon="mdi:cake-variant"
                              width={20}
                              height={20}
                              sx={{ color: 'text.secondary', mt: 0.5 }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {t('Age')}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {age.years} {t('years')}{' '}
                                {age.months > 0 &&
                                  `${age.months} ${t('months')}`}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:dog"
                            width={20}
                            height={20}
                            sx={{ color: 'text.secondary', mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t('Breed')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {BreedOptions.todos.find(
                                (breed) => breed.value === petProfile?.breed
                              )?.label || 'Unknown breed'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Health & Requirements - antes de Digital ID */}
                        {canShowHealthAndRequirements &&
                          petProfile.healthAndRequirements && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Iconify
                                icon="mdi:medical-bag"
                                width={20}
                                height={20}
                                sx={{ color: 'text.secondary', mt: 0.5 }}
                              />
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {t('Health & Requirements')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {petProfile.healthAndRequirements}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                        {/* Digital ID - al final de la columna derecha */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:shield-account"
                            width={20}
                            height={20}
                            sx={{ color: 'text.secondary', mt: 0.5 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t('Digital ID')}
                            </Typography>

                            {!petProfile.isDigitalIdentificationActive ? (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      ¿Quieres activar la cédula digital?
                                    </Typography>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={
                                          <Iconify
                                            icon="mdi:email"
                                            width={16}
                                          />
                                        }
                                        href={mailtoHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{ textTransform: 'none' }}
                                      >
                                        Email
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={
                                          <Iconify
                                            icon="mdi:whatsapp"
                                            width={16}
                                          />
                                        }
                                        href={`https://wa.me/${PHONE_SUPPORT}?text=${encodeURIComponent(
                                          'Hola, me interesa activar la cédula digital para mi mascota. ¿Podrían ayudarme? 🐾'
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                          textTransform: 'none',
                                          bgcolor: '#25D366',
                                          '&:hover': { bgcolor: '#128C7E' },
                                        }}
                                      >
                                        WhatsApp
                                      </Button>
                                    </Stack>
                                  </Box>
                                }
                                arrow
                                placement="top"
                                enterTouchDelay={0}
                                leaveTouchDelay={5000}
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: 'background.paper',
                                      color: 'text.primary',
                                      boxShadow: 3,
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      fontSize: '0.875rem',
                                      p: 1.5,
                                      maxWidth: 280,
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
                                <Chip
                                  onClick={(e) => e.stopPropagation()}
                                  label="Inactiva"
                                  size="small"
                                  sx={{ mt: 0.5, fontWeight: 500 }}
                                  color="default"
                                  icon={
                                    <Iconify
                                      icon="mdi:shield-off"
                                      width={16}
                                      height={16}
                                    />
                                  }
                                />
                              </Tooltip>
                            ) : (
                              <Chip
                                label="Activa"
                                size="small"
                                sx={{ mt: 0.5, fontWeight: 500 }}
                                color="success"
                                icon={
                                  <Iconify
                                    icon="mdi:shield-check"
                                    width={16}
                                    height={16}
                                  />
                                }
                              />
                            )}
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              {!petProfile.isDigitalIdentificationActive && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'warning.main',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Iconify
                    icon="mdi:shield-alert"
                    width={20}
                    height={20}
                    sx={{ color: 'warning.main', mt: 0.2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      mb={2}
                    >
                      <Stack>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                        >
                          {t('Digital ID not activated')}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {t(
                            'Activate your pet digital ID to access exclusive benefits and keep your pet safe.'
                          )}
                        </Typography>
                      </Stack>
                      <Stack>
                        <Image
                          src="/assets/images/digital-id/Costa-Rica-ID.png"
                          alt={petProfile.petName}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1.5,
                          }}
                          // overlay={alpha(theme.palette.grey[900], 0.48)}
                        />
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="mdi:email" width={16} />}
                        href={mailtoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textTransform: 'none' }}
                      >
                        {t('Contact by Email')}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Iconify icon="mdi:whatsapp" width={16} />}
                        href={`https://wa.me/${PHONE_SUPPORT}?text=${encodeURIComponent(
                          'Hola, me interesa activar la cédula digital para mi mascota. ¿Podrían ayudarme? 🐾'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: 'none',
                          bgcolor: '#25D366',
                          '&:hover': { bgcolor: '#128C7E' },
                        }}
                      >
                        {t('Contact by WhatsApp')}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Columna derecha - Información detallada */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              {/* Información del propietario */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('Owner Information')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      {canShowOwnerPetName && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('Owner Name')}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {petProfile.ownerPetName || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Country')}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {petProfile.owner?.country || 'N/A'}
                        </Typography>
                      </Box>
                      {canShowPhoneInfo && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('Phone Number')}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {petProfile.phone || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      {canShowAddressInfo && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('Address')}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {petProfile.address || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Pet ID')}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          #{petProfile.memberPetId}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Registration Date')}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {fDate(petProfile.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>

              {/* Información veterinaria */}
              {(canShowVeterinarianContact || canShowPhoneVeterinarian) && (
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    {t('Veterinary Information')}
                  </Typography>
                  <Grid container spacing={2}>
                    {canShowVeterinarianContact && (
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('Veterinarian')}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {petProfile.veterinarianContact || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {canShowPhoneVeterinarian && (
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('Veterinary Phone Number')}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {petProfile.phoneVeterinarian || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )}

              {/* Tarjeta digital de Costa Rica */}
              {petProfile.isDigitalIdentificationActive && (
                <Card sx={{ py: 2 }}>
                  <CostaRicaIDCard data={petProfile} />
                </Card>
              )}

              <Card>
                {canShowLocationInfo && (
                  <Box
                    sx={{
                      maxHeight: isMobile ? '85vh' : '55vh',
                      overflow: 'auto',
                    }}
                  >
                    <Stack spacing={3}>
                      <Typography p={2} variant="h6">
                        📍 {t('Pet Location')}
                      </Typography>

                      <PetLocationMap
                        initialLocation={petLocation}
                        onLocationChange={(loc) =>
                          setPetLocation({
                            lat: loc.lat,
                            lng: loc.lng,
                            address: loc.address ?? '',
                          })
                        }
                        readOnly
                      />
                    </Stack>
                  </Box>
                )}
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

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
              borderRadius: 2,
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
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setOpenImage(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            alt={petProfile.petName}
            src={petProfile.photo}
            sx={{
              width: isMobile ? 250 : 400,
              height: isMobile ? 250 : 400,
              objectFit: 'cover',
              mx: 'auto',
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
