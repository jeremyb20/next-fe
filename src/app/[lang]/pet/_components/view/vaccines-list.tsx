// components/medical-records/vaccines-list.tsx
import React from 'react';
import Iconify from '@/src/components/iconify';
import { IVaccineFormData } from '@/src/interfaces/medical-record';

import {
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

interface VaccinesListProps {
  data: IVaccineFormData[];
  onEdit: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: IVaccineFormData
  ) => void;
  refetchTrigger?: number;
  isLoading?: boolean;
}

export default function VaccinesList({
  data,
  onEdit,
  refetchTrigger,
  isLoading,
}: VaccinesListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <CircularProgress />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Cargando vacunas...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    return date >= today && date <= next30Days;
  };

  const isOverdue = (dateString: string) => new Date(dateString) < new Date();

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <Iconify
              icon="mdi:needle-off"
              width={48}
              sx={{ opacity: 0.5, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No hay vacunas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Comienza agregando la primera vacuna de tu mascota
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((vaccine, index) => (
        <Card key={vaccine._id || index} sx={{ position: 'relative' }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="h6" component="div">
                    {vaccine.vaccineName}
                  </Typography>
                  {isUpcoming(vaccine.nextVaccineDate) && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: 'warning.light',
                        color: 'warning.contrastText',
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      PRÓXIMA
                    </Box>
                  )}
                  {isOverdue(vaccine.nextVaccineDate) && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      VENCIDA
                    </Box>
                  )}
                </Stack>

                <Stack spacing={1}>
                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha de aplicación:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(vaccine.dateOfApplication)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Próxima vacuna:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            isUpcoming(vaccine.nextVaccineDate) ||
                            isOverdue(vaccine.nextVaccineDate)
                              ? 'bold'
                              : 'normal',
                          color: isOverdue(vaccine.nextVaccineDate)
                            ? 'error.main'
                            : 'inherit',
                        }}
                      >
                        {formatDate(vaccine.nextVaccineDate)}
                      </Typography>
                    </Box>
                  </Stack>

                  {vaccine.observations && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Observaciones:
                      </Typography>
                      <Typography variant="body2">
                        {vaccine.observations}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <IconButton
                onClick={() => onEdit('vaccine', vaccine)}
                sx={{ ml: 1 }}
                size="small"
              >
                <Iconify icon="mdi:pencil" />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
