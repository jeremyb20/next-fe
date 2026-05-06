// components/pets/pet-dashboard.tsx

import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { ALLOW_MAX_PETS_BY_USER } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useMedicalRecordForm } from '@/hooks/user-medical-record-form';
import MedicalRecordForm from '@/app/[lang]/pet/_components/forms/medical-record-form';

import { Box, Grid, Card, Button, Typography } from '@mui/material';

import { PetAvatarList } from './pet-avatar-list';
import { PetDetailsCard } from './pet-details-card';

interface PetDashboardProps {
  isFetching: boolean;
  usersData?: IPetProfile[];
  onPetDelete?: (pet: IPetProfile) => void;
  onPetView?: (pet: IPetProfile) => void;
  onPetEdit?: (pet: IPetProfile) => void;
  onAddMore?: () => void;
  emptyMessage?: string;
  maxPets?: number;
  refetch: () => void;
}

export function PetDashboard({
  isFetching,
  usersData,
  onPetDelete,
  onPetView,
  onPetEdit,
  onAddMore,
  emptyMessage = 'No pets found',
  maxPets = Number(ALLOW_MAX_PETS_BY_USER),
  refetch: refetchPets,
}: PetDashboardProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(
    undefined
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshingRef = useRef(false);
  const { t } = useTranslation();
  const {
    open,
    currentType,
    currentRecord,
    petId,
    closeForm,
    createRecord,
    editRecord,
  } = useMedicalRecordForm();

  // Obtener la mascota seleccionada de los datos actualizados
  const selectedPet = usersData?.find((pet) => pet._id === selectedPetId);

  // Función para refrescar los datos después de una operación médica
  const handleMedicalRecordSuccess = useCallback(() => {
    // Evitar llamadas múltiples
    if (refreshingRef.current) return;

    refreshingRef.current = true;

    // Solo refrescar la lista de mascotas una vez
    refetchPets();

    // Forzar re-render del PetDetailsCard
    setRefreshKey((prev) => prev + 1);

    // Resetear el flag después de un tiempo
    setTimeout(() => {
      refreshingRef.current = false;
    }, 500);
  }, [refetchPets]);

  // Seleccionar la primera mascota automáticamente cuando los datos se cargan
  useEffect(() => {
    if (usersData && usersData.length > 0 && !selectedPetId) {
      setSelectedPetId(usersData[0]._id);
    }
  }, [usersData, selectedPetId]);

  // Si la mascota seleccionada ya no existe en los datos (fue eliminada), seleccionar otra
  useEffect(() => {
    if (
      selectedPetId &&
      usersData &&
      !usersData.find((pet) => pet._id === selectedPetId)
    ) {
      setSelectedPetId(usersData[0]?._id || undefined);
    }
  }, [usersData, selectedPetId]);

  if (!usersData || usersData.length === 0) {
    return (
      <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <Iconify
          icon="tabler:paw-off"
          width={64}
          sx={{ mb: 2, color: 'text.secondary' }}
        />
        <Typography variant="h6" gutterBottom>
          {t(emptyMessage)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('You can have up to {{maxPets}} pets registered', { maxPets })}
        </Typography>
        <Button
          variant="contained"
          onClick={onAddMore}
          startIcon={<Iconify icon="eva:plus-fill" />}
          size="large"
        >
          {t('Add Your First Pet')}
        </Button>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Lista de mascotas estilo avatares */}
      <Grid item xs={12}>
        <Box sx={{ borderRadius: 3 }}>
          <PetAvatarList
            pets={usersData}
            selectedPetId={selectedPetId}
            onSelectPet={(pet) => setSelectedPetId(pet._id)}
            onAddMore={onAddMore}
            maxPets={maxPets}
            isFetching={isFetching}
          />
        </Box>
      </Grid>

      {/* Detalles de la mascota seleccionada */}
      <Grid item xs={12}>
        {selectedPet ? (
          <PetDetailsCard
            key={`${selectedPet._id}-${refreshKey}`}
            pet={selectedPet}
            onEdit={onPetEdit}
            onDelete={onPetDelete}
            onViewMedicalRecords={onPetView}
            isFetching={isFetching}
            onEditMedicalRecord={(type, record) => {
              editRecord(type, record, selectedPet?.memberPetId || '');
            }}
            onCreateRecord={(type, pPetId) => {
              createRecord(type, pPetId);
            }}
            onMedicalRecordSuccess={handleMedicalRecordSuccess}
          />
        ) : (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {t('Select a pet to view details')}
            </Typography>
          </Card>
        )}

        <MedicalRecordForm
          open={open}
          onClose={() => {
            closeForm();
          }}
          type={currentType}
          petId={petId}
          currentRecord={currentRecord}
          refetch={() => {
            // Solo llamar a handleMedicalRecordSuccess, no directamente a refetchPets
            handleMedicalRecordSuccess();
          }}
          onSubmitSuccess={() => {
            // Solo llamar a handleMedicalRecordSuccess, no directamente a refetchPets
            closeForm();
            handleMedicalRecordSuccess();
          }}
        />
      </Grid>
    </Grid>
  );
}
