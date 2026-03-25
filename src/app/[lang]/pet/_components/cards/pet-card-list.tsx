// components/dashboard/user/pet-card.tsx
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { fToNow } from '@/utils/format-time';
import { BreedOptions } from '@/utils/constants';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import { Stack } from '@mui/system';
import {
  Box,
  Card,
  Chip,
  Avatar,
  Tooltip,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

interface PetCardProps {
  pet: IPetProfile;
  index: number;
  onDelete?: (pet: IPetProfile) => void;
  onView?: (pet: IPetProfile) => void;
  onEdit?: (pet: IPetProfile) => void;
}

// Función para calcular la edad
const calculateAge = (birthDate: string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  return 'Less than 1 month';
};

// Función para obtener estadísticas del medicalRecord
const getMedicalStats = (pet: IPetProfile) => {
  const vaccines = pet.medicalRecord?.vaccines?.length || 0;
  const deworming = pet.medicalRecord?.deworming?.length || 0;
  const medicalVisits = pet.medicalRecord?.datesOfMedicalVisits?.length || 0;

  // Verificar vacunas próximas
  const upcomingVaccines =
    pet.medicalRecord?.vaccines?.filter((v) => {
      if (v.nextVaccineDate) {
        const nextDate = new Date(v.nextVaccineDate);
        const today = new Date();
        const daysUntil = Math.ceil(
          (nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );
        return daysUntil <= 30 && daysUntil > 0;
      }
      return false;
    }) || [];

  // Verificar desparasitaciones próximas
  const upcomingDeworming =
    pet.medicalRecord?.deworming?.filter((d) => {
      if (d.nextDewormingDate) {
        const nextDate = new Date(d.nextDewormingDate);
        const today = new Date();
        const daysUntil = Math.ceil(
          (nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );
        return daysUntil <= 30 && daysUntil > 0;
      }
      return false;
    }) || [];

  return {
    vaccines,
    deworming,
    medicalVisits,
    upcomingVaccines: upcomingVaccines.length,
    upcomingDeworming: upcomingDeworming.length,
    totalRecords: vaccines + deworming + medicalVisits,
  };
};

// Función para obtener la última vacuna
const getLastVaccine = (pet: IPetProfile) => {
  if (!pet.medicalRecord?.vaccines?.length) return null;
  const sorted = [...pet.medicalRecord.vaccines].sort(
    (a, b) =>
      new Date(b.dateOfApplication).getTime() -
      new Date(a.dateOfApplication).getTime()
  );
  return sorted[0];
};

// Función para obtener la próxima vacuna
const getNextVaccine = (pet: IPetProfile) => {
  if (!pet.medicalRecord?.vaccines?.length) return null;
  const now = new Date();
  const upcoming = pet.medicalRecord.vaccines
    .filter((v) => {
      if (v.nextVaccineDate) {
        return new Date(v.nextVaccineDate) >= now;
      }
      return false;
    })
    .sort(
      (a, b) =>
        new Date(a.nextVaccineDate!).getTime() -
        new Date(b.nextVaccineDate!).getTime()
    );
  return upcoming[0] || null;
};

export function PetCard({
  pet,
  index,
  onDelete,
  onView,
  onEdit,
}: PetCardProps) {
  const popover = usePopover();
  const medicalStats = getMedicalStats(pet);
  const lastVaccine = getLastVaccine(pet);
  const nextVaccine = getNextVaccine(pet);
  const age = calculateAge(pet.birthDate);

  // Determinar color según estado de salud
  const getHealthStatusColor = () => {
    if (medicalStats.upcomingVaccines > 0) return 'warning';
    if (medicalStats.upcomingDeworming > 0) return 'warning';
    if (medicalStats.totalRecords === 0) return 'error';
    return 'success';
  };

  // Determinar texto de estado
  const getHealthStatusText = () => {
    if (medicalStats.upcomingVaccines > 0) return 'Vaccination due soon';
    if (medicalStats.upcomingDeworming > 0) return 'Deworming due soon';
    if (medicalStats.totalRecords === 0) return 'No medical records';
    return 'Up to date';
  };

  const handleDelete = () => {
    popover.onClose();
    onDelete?.(pet);
  };

  const handleView = () => {
    popover.onClose();
    onView?.(pet);
  };

  const handleEdit = () => {
    popover.onClose();
    onEdit?.(pet);
  };

  return (
    <>
      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          bgcolor: 'background.paper',
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.shadows[4],
          },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header con avatar y menú */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Avatar
              src={pet.photo}
              sx={{ width: 70, height: 70, borderRadius: 2 }}
              alt={pet.petName}
            >
              {pet.petName?.charAt(0) || '?'}
            </Avatar>
            <IconButton
              size="small"
              onClick={popover.onOpen}
              sx={{ color: 'text.secondary' }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>

          {/* Nombre y detalles básicos */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            {pet.petName || 'No name'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              {BreedOptions.todos.find((breed) => breed.value === pet.breed)
                ?.label || 'Unknown breed'}
            </Typography>
            {age && (
              <>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {age}
                </Typography>
              </>
            )}
          </Stack>

          {/* Status Chip */}
          <Chip
            label={getHealthStatusText()}
            size="small"
            color={getHealthStatusColor()}
            sx={{
              height: 24,
              fontSize: '0.7rem',
              fontWeight: 500,
            }}
          />

          <Divider sx={{ my: 1.5 }} />

          {/* Estadísticas médicas */}
          <Stack spacing={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="mdi:needle" width={16} color="#FF6B6B" />
                <Typography variant="caption" color="text.secondary">
                  Vaccines
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {medicalStats.vaccines}
                </Typography>
                {medicalStats.upcomingVaccines > 0 && (
                  <Tooltip
                    title={`${medicalStats.upcomingVaccines} vaccine(s) due soon`}
                  >
                    <Chip
                      label={`+${medicalStats.upcomingVaccines}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: 'warning.lighter',
                        color: 'warning.dark',
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="mdi:pill" width={16} color="#4ECDC4" />
                <Typography variant="caption" color="text.secondary">
                  Deworming
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {medicalStats.deworming}
                </Typography>
                {medicalStats.upcomingDeworming > 0 && (
                  <Tooltip
                    title={`${medicalStats.upcomingDeworming} deworming(s) due soon`}
                  >
                    <Chip
                      label={`+${medicalStats.upcomingDeworming}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: 'warning.lighter',
                        color: 'warning.dark',
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="mdi:doctor" width={16} color="#95E77E" />
                <Typography variant="caption" color="text.secondary">
                  Medical Visits
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {medicalStats.medicalVisits}
              </Typography>
            </Box>
          </Stack>

          {/* Próxima vacuna si existe */}
          {nextVaccine && (
            <Box
              sx={{ mt: 1.5, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Iconify icon="mdi:calendar-clock" width={12} />
                <Typography variant="caption" fontWeight={600}>
                  Next vaccine:
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {nextVaccine.vaccineName} -{' '}
                {new Date(nextVaccine.nextVaccineDate!).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* Última actualización */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 1.5,
              textAlign: 'right',
              fontSize: '0.65rem',
            }}
          >
            Updated: {fToNow(pet.updatedAt)}
          </Typography>
        </CardContent>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleView}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
