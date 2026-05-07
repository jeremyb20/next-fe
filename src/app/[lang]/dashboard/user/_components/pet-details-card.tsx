// components/pets/pet-details-card.tsx
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { useState, useEffect } from 'react';
import { PHONE_SUPPORT } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';
import { BreedOptions, GENDER_OPTIONS } from '@/utils/constants';
import { usePetAgeCalculator } from '@/hooks/use-pet-age-calculator';
import { formatPetAge, getSpeciesFromBreed } from '@/utils/pet-age.utils';

// Importar los componentes reutilizables

import CustomPopover, { usePopover } from '@/components/custom-popover';
import { PetAvatarWithBadge } from '@/components/badge/PetAvatarWithBage';
import VaccinesList from '@/app/[lang]/pet/_components/view/vaccines-list';
import DewormingList from '@/app/[lang]/pet/_components/view/deworming-list';
import MedicalVisitsList from '@/app/[lang]/pet/_components/view/medical-visits-list';

import {
  Box,
  Card,
  Chip,
  Grid,
  List,
  Stack,
  Button,
  Divider,
  Tooltip,
  ListItem,
  MenuItem,
  Typography,
  IconButton,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';

import PetDetailsSkeleton from './pet-details-skeleton';

interface PetDetailsCardProps {
  pet?: IPetProfile;
  onEdit?: (pet: IPetProfile) => void;
  onViewDetails?: (pet: IPetProfile) => void;
  onDelete?: (pet: IPetProfile) => void;
  onViewMedicalRecords?: (pet: IPetProfile) => void;
  isFetching?: boolean;
  onEditMedicalRecord?: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: any
  ) => void;
  onCreateRecord?: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    petId: string
  ) => void;
  onMedicalRecordSuccess?: () => void;
}

type MedicalSection = 'summary' | 'vaccines' | 'deworming' | 'visits';

export function PetDetailsCard({
  pet,
  onEdit,
  onViewDetails,
  onDelete,
  onViewMedicalRecords,
  isFetching,
  onEditMedicalRecord,
  onCreateRecord,
  onMedicalRecordSuccess,
}: PetDetailsCardProps) {
  const { ageResult, calculateAge } = usePetAgeCalculator();
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] =
    useState<MedicalSection>('summary');
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);
  const popover = usePopover();
  const detectedSpecies = pet?.breed ? getSpeciesFromBreed(pet.breed) : null;
  useEffect(() => {
    // Solo refrescar cuando los datos médicos realmente cambien
    setLocalRefreshTrigger((prev) => prev + 1);
  }, [
    pet?.medicalRecord?.vaccines?.length,
    pet?.medicalRecord?.deworming?.length,
    pet?.medicalRecord?.datesOfMedicalVisits?.length,
  ]);
  useEffect(() => {
    if (pet?.birthDate) {
      calculateAge(pet.birthDate, pet.breed);
    }
  }, [pet?.birthDate, pet?.breed, calculateAge]);

  const formattedAge = ageResult
    ? formatPetAge(ageResult, 'detailed', t)
    : 'Not available';

  const handleBackToSummary = () => {
    setSelectedSection('summary');
  };

  // Modifica las funciones que llaman a onEditMedicalRecord y onCreateRecord
  const handleEditRecord = (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: any
  ) => {
    onEditMedicalRecord?.(type, record);
  };

  const handleCreateRecord = (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    petId: string
  ) => {
    onCreateRecord?.(type, petId);
  };

  // Transformar datos para los componentes específicos
  const transformToVaccineData = () => {
    if (!pet?.medicalRecord?.vaccines) return [];
    return pet.medicalRecord.vaccines.map((vaccine) => ({
      _id: vaccine._id,
      dateOfApplication: vaccine.dateOfApplication,
      nextVaccineDate: vaccine.nextVaccineDate,
      vaccineName: vaccine.vaccineName,
      observations: vaccine.observations,
    }));
  };

  const transformToDewormingData = () => {
    if (!pet?.medicalRecord?.deworming) return [];
    return pet.medicalRecord.deworming.map((deworming) => ({
      _id: deworming._id,
      dateOfApplication: deworming.dateOfApplication,
      nextDewormingDate: deworming.nextDewormingDate,
      dewormerName: deworming.dewormerName,
      observations: deworming.observations,
    }));
  };

  const transformToMedicalVisitData = () => {
    if (!pet?.medicalRecord?.datesOfMedicalVisits) return [];
    return pet.medicalRecord.datesOfMedicalVisits.map((visit) => ({
      _id: visit._id,
      visitDate: visit.visitDate,
      reasonForVisit: visit.reasonForVisit,
      veterinarianName: visit.veterinarianName,
      observations: visit.observations,
    }));
  };

  const renderMedicalContent = () => {
    switch (selectedSection) {
      case 'vaccines':
        return (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 1,
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IconButton onClick={handleBackToSummary} size="small">
                  <Iconify icon="mdi:arrow-left" width={20} />
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('Vaccination')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({pet?.medicalRecord?.vaccines?.length || 0} {t('records')})
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() =>
                  handleCreateRecord?.('vaccine', pet?.memberPetId || '')
                }
                startIcon={<Iconify icon="mdi:needle" />}
                disabled={!pet}
              >
                {t('Add Vaccine')}
              </Button>
            </Box>
            <VaccinesList
              key={`vaccines-${localRefreshTrigger}`}
              data={transformToVaccineData()}
              onEdit={(type, record) => handleEditRecord(type, record)}
              isLoading={false}
            />
          </Box>
        );

      case 'deworming':
        return (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 1,
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IconButton onClick={handleBackToSummary} size="small">
                  <Iconify icon="mdi:arrow-left" width={20} />
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('Deworming')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({pet?.medicalRecord?.deworming?.length || 0} {t('records')}
                    )
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() =>
                  handleCreateRecord?.('deworming', pet?.memberPetId || '')
                }
                startIcon={<Iconify icon="fluent:pill-16-regular" />}
                disabled={!pet}
              >
                {t('Add Deworming')}
              </Button>
            </Box>
            <DewormingList
              key={`deworming-${localRefreshTrigger}`}
              data={transformToDewormingData()}
              onEdit={(type, record) => handleEditRecord(type, record)}
              isLoading={false}
            />
          </Box>
        );

      case 'visits':
        return (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 1,
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IconButton onClick={handleBackToSummary} size="small">
                  <Iconify icon="mdi:arrow-left" width={20} />
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('Medical Visits')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({pet?.medicalRecord?.datesOfMedicalVisits?.length || 0}{' '}
                    {t('records')})
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() =>
                  handleCreateRecord?.('medical_visit', pet?.memberPetId || '')
                }
                startIcon={<Iconify icon="solar:calendar-date-bold-duotone" />}
                disabled={!pet}
              >
                {t('Add Medical Visit')}
              </Button>
            </Box>
            <MedicalVisitsList
              key={`medical_-${localRefreshTrigger}`}
              data={transformToMedicalVisitData()}
              onEdit={(type, record) => handleEditRecord(type, record)}
              isLoading={false}
            />
          </Box>
        );

      default:
        return (
          <Stack>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              {t('Medical Summary')}
            </Typography>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {/* Vacunas */}
              <ListItem
                disablePadding
                onClick={() => setSelectedSection('vaccines')}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="mdi:syringe" width={24} color="#4CAF50" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('Vaccination')}
                    secondary={`${
                      pet?.medicalRecord?.vaccines?.length || 0
                    } ${t('records')}`}
                  />
                  <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
                    {pet?.medicalRecord?.vaccines?.length || 0}
                  </Typography>
                  <Iconify
                    icon="mdi:chevron-right"
                    width={24}
                    color="action.active"
                  />
                </ListItemButton>
              </ListItem>

              <Divider variant="inset" component="li" />

              {/* Desparasitaciones */}
              <ListItem
                disablePadding
                onClick={() => setSelectedSection('deworming')}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="mdi:pill" width={24} color="#FF9800" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('Deworming')}
                    secondary={`${
                      pet?.medicalRecord?.deworming?.length || 0
                    } ${t('records')}`}
                  />
                  <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
                    {pet?.medicalRecord?.deworming?.length || 0}
                  </Typography>
                  <Iconify
                    icon="mdi:chevron-right"
                    width={24}
                    color="action.active"
                  />
                </ListItemButton>
              </ListItem>

              <Divider variant="inset" component="li" />

              {/* Visitas médicas */}
              <ListItem
                disablePadding
                onClick={() => setSelectedSection('visits')}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify
                      icon="mdi:stethoscope"
                      width={24}
                      color="#2196F3"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('Medical Visit')}
                    secondary={`${
                      pet?.medicalRecord?.datesOfMedicalVisits?.length || 0
                    } ${t('records')}`}
                  />
                  <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
                    {pet?.medicalRecord?.datesOfMedicalVisits?.length || 0}
                  </Typography>
                  <Iconify
                    icon="mdi:chevron-right"
                    width={24}
                    color="action.active"
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Stack>
        );
    }
  };

  // Mostrar skeleton mientras carga
  if (isFetching || !pet) {
    return <PetDetailsSkeleton />;
  }

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Card sx={{ py: 2, px: 1, borderRadius: 3 }}>
        {/* Header con foto y nombre */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PetAvatarWithBadge pet={pet} size={100} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {pet.petName} ({pet.memberPetId})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={t(
                    GENDER_OPTIONS.find(
                      (gender) => gender.value === pet.genderSelected
                    )?.label || 'N/A'
                  )}
                  size="small"
                  icon={
                    <Iconify
                      icon={
                        pet.genderSelected === 'male'
                          ? 'tabler:male'
                          : 'tabler:female'
                      }
                    />
                  }
                />
                <Chip
                  label={
                    BreedOptions.todos.find(
                      (breed) => breed.value === pet.breed
                    )?.label || t('Unknown breed')
                  }
                  size="small"
                  icon={<Iconify icon="tabler:paw" />}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </Box>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={() => {
              // onViewRow();
              onViewDetails?.(pet);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            {t('View details')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              // onEditRow();
              onEdit?.(pet);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t('Edit')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              // confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('Delete')}
          </MenuItem>
        </CustomPopover>
        <Divider sx={{ my: 1 }} />

        {/* Información detallada */}

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
                  icon="tabler:calendar"
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
                    {t('Pet age')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formattedAge}
                  </Typography>
                </Box>
              </Box>

              {pet.genderSelected && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Iconify
                    icon={
                      pet.genderSelected === 'Male'
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
                      {t(
                        GENDER_OPTIONS.find(
                          (gender) => gender.value === pet.genderSelected
                        )?.label || 'N/A'
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Favorite Activities */}
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
                    {pet.favoriteActivities || t('Not specified')}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={6} sm={6}>
            <Stack spacing={2.5}>
              {pet.breed && (
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
                        (breed) => breed.value === pet?.breed
                      )?.label || t('Unknown breed')}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Health & Requirements */}
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
                    {pet.healthAndRequirements || t('Not specified')}
                  </Typography>
                </Box>
              </Box>

              {/* Digital ID */}
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

                  {!pet.isDigitalIdentificationActive ? (
                    <Tooltip
                      title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {t('Would you like to activate your digital ID?')}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={
                                <Iconify icon="mdi:whatsapp" width={16} />
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
                        label={t('Inactive')}
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
                      label={t('Active')}
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

        <Box
          component="img"
          src={
            pet.petStatus === 'deceased'
              ? '/assets/images/ribbon.png'
              : `/assets/images/paw-${detectedSpecies}.png`
          }
          alt="Decorative"
          sx={{
            position: 'absolute',
            bottom: pet.petStatus === 'deceased' ? -2 : -12,
            right: pet.petStatus === 'deceased' ? -12 : -30,
            width: 140,
            height: 'auto',
            objectFit: 'contain',
            zIndex: 0,
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />
      </Card>

      <Card sx={{ mt: 3, p: 2, borderRadius: 3 }}>
        <Box>{renderMedicalContent()}</Box>
      </Card>
    </Box>
  );
}
