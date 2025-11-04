// components/medical-records/medical-visits-list.tsx
import React from 'react';
import Iconify from '@/src/components/iconify';
import { IMedicalVisitFormData } from '@/src/interfaces/medical-record';

import {
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

// Mapeo de razones de visita a labels
const REASON_LABELS: { [key: string]: string } = {
  annual_checkup: 'Chequeo anual',
  vaccination: 'Vacunación',
  deworming: 'Desparasitación',
  weight_control: 'Control de peso',
  digestive_issues: 'Problemas digestivos',
  skin_problems: 'Problemas de piel',
  injury_accident: 'Lesión o accidente',
  surgery: 'Cirugía',
  dental_care: 'Control dental',
  behavior: 'Comportamiento',
  other: 'Otro',
};

interface MedicalVisitsListProps {
  data: IMedicalVisitFormData[];
  onEdit: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: IMedicalVisitFormData
  ) => void;
  refetchTrigger?: number;
  isLoading?: boolean;
}

export default function MedicalVisitsList({
  data,
  onEdit,
  refetchTrigger,
  isLoading,
}: MedicalVisitsListProps) {
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

  const getReasonLabel = (reasonValue: string) =>
    REASON_LABELS[reasonValue] || reasonValue;

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <Iconify
              icon="solar:calendar-date-bold-duotone"
              width={48}
              sx={{ opacity: 0.5, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No hay visitas médicas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Comienza agregando la primera visita médica de tu mascota
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((visit, index) => (
        <Card key={visit._id || index}>
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
                    {getReasonLabel(visit.reasonForVisit)}
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha de visita:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(visit.visitDate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Veterinario:
                      </Typography>
                      <Typography variant="body2">
                        {visit.veterinarianName}
                      </Typography>
                    </Box>
                  </Stack>

                  {visit.observations && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Observaciones:
                      </Typography>
                      <Typography variant="body2">
                        {visit.observations}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <IconButton
                onClick={() => onEdit('medical_visit', visit)}
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
