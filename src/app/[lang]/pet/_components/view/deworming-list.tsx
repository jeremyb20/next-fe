// components/medical-records/deworming-list.tsx
import React from 'react';
import Iconify from '@/src/components/iconify';
import { IDewormingFormData } from '@/src/interfaces/medical-record';

import {
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

interface DewormingListProps {
  data: IDewormingFormData[];
  onEdit: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: IDewormingFormData
  ) => void;
  refetchTrigger?: number;
  isLoading?: boolean;
}

export default function DewormingList({
  data,
  onEdit,
  refetchTrigger,
  isLoading,
}: DewormingListProps) {
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
              icon="fluent:pill-16-regular"
              width={48}
              sx={{ opacity: 0.5, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No hay desparasitaciones registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Comienza agregando la primera desparasitación de tu mascota
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((deworming, index) => (
        <Card key={deworming._id || index} sx={{ position: 'relative' }}>
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
                    {deworming.dewormerName}
                  </Typography>
                  {isUpcoming(deworming.nextDewormingDate) && (
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
                  {isOverdue(deworming.nextDewormingDate) && (
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
                        {formatDate(deworming.dateOfApplication)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Próxima desparasitación:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            isUpcoming(deworming.nextDewormingDate) ||
                            isOverdue(deworming.nextDewormingDate)
                              ? 'bold'
                              : 'normal',
                          color: isOverdue(deworming.nextDewormingDate)
                            ? 'error.main'
                            : 'inherit',
                        }}
                      >
                        {formatDate(deworming.nextDewormingDate)}
                      </Typography>
                    </Box>
                  </Stack>

                  {deworming.observations && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Observaciones:
                      </Typography>
                      <Typography variant="body2">
                        {deworming.observations}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <IconButton
                onClick={() => onEdit('deworming', deworming)}
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
