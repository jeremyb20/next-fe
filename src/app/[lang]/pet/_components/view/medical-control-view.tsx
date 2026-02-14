import { useSnackbar } from 'notistack';
import { IPetProfile } from '@/src/types/api';
import Iconify from '@/src/components/iconify';
import React, { useMemo, useState, useCallback } from 'react';
import { useSettingsContext } from '@/src/components/settings';
import CardComponent from '@/src/sections/_examples/card-component';
import FilterToolbar from '@/src/components/filters/filter-toolbar';
import { useMedicalRecordForm } from '@/src/hooks/user-medical-record-form';
import { MEDICAL_RECORD_FILTER_TOOLBAR } from '@/src/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetMedicalRecordsByPet,
} from '@/src/hooks/use-fetch-paginated';

import { Box } from '@mui/system';
import {
  Tab,
  Tabs,
  Card,
  Alert,
  Button,
  Container,
  Typography,
} from '@mui/material';

import { isAfter } from 'src/utils/format-time';

import VaccinesList from './vaccines-list';
import DewormingList from './deworming-list';
import MedicalVisitsList from './medical-visits-list';
import MedicalRecordForm from '../forms/medical-record-form';

type MedicalRecordType = 'vaccine' | 'deworming' | 'medical_visit';

export default function MedicalControlView({
  currentPet,
}: {
  currentPet: IPetProfile | undefined;
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    currentType,
    currentRecord,
    petId,
    closeForm,
    createRecord,
    editRecord,
  } = useMedicalRecordForm();

  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 10,
    petId: currentPet?.memberPetId,
  });

  const dateError = useMemo(() => {
    const startDate = activeFilters.startDate
      ? new Date(activeFilters.startDate)
      : null;
    const endDate = activeFilters.endDate
      ? new Date(activeFilters.endDate)
      : null;
    return isAfter(startDate, endDate);
  }, [activeFilters.startDate, activeFilters.endDate]);

  const {
    data: medicalRecordData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMedicalRecordsByPet(activeFilters);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
      // Actualizar el filtro de tipo según la pestaña seleccionada
      let typeFilter: MedicalRecordType | undefined;
      switch (newValue) {
        case 0:
          typeFilter = 'vaccine';
          break;
        case 1:
          typeFilter = 'deworming';
          break;
        case 2:
          typeFilter = 'medical_visit';
          break;
        default:
          typeFilter = undefined;
      }

      setActiveFilters((prev) => ({
        ...prev,
        type: typeFilter,
        page: 1, // Resetear a primera página al cambiar de pestaña
      }));
    },
    []
  );

  const refetchMedicalRecords = () => {
    refetch();
    setRefetchTrigger((prev) => prev + 1);
  };

  // Función para manejar la edición de registros
  const handleEditRecord = (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: any
  ) => {
    editRecord(type, record, currentPet?.memberPetId || '');
  };

  const handleFiltersChange = useCallback(
    (newFilters: Partial<UserQueryParams>) => {
      setActiveFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Resetear a primera página al aplicar nuevos filtros
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    refetch();
    enqueueSnackbar('Búsqueda realizada', { variant: 'success' });
  }, [enqueueSnackbar, refetch]);

  const handleClear = useCallback(() => {
    const clearedFilters = {
      page: 1,
      limit: 10,
      petId: currentPet?.memberPetId,
      type: getTypeFromTab(currentTab),
    };

    setActiveFilters(clearedFilters);
    enqueueSnackbar('Filtros limpiados', { variant: 'info' });
  }, [currentTab, enqueueSnackbar, currentPet?.memberPetId]);

  // Filtrar datos según la pestaña actual
  const getFilteredData = () => {
    if (!medicalRecordData?.payload) return [];

    const currentTypeT = getTypeFromTab(currentTab);
    return medicalRecordData.payload.filter(
      (record) => record.type === currentTypeT
    );
  };

  const getTypeFromTab = (tabIndex: number): MedicalRecordType => {
    switch (tabIndex) {
      case 0:
        return 'vaccine';
      case 1:
        return 'deworming';
      case 2:
        return 'medical_visit';
      default:
        return 'vaccine';
    }
  };

  // Transformar datos para los componentes específicos
  const transformToVaccineData = (records: any[]) =>
    records.map((record) => ({
      _id: record._id,
      dateOfApplication: record.date,
      nextVaccineDate: record.nextDate,
      vaccineName: record.name,
      observations: record.observations,
    }));

  const transformToDewormingData = (records: any[]) =>
    records.map((record) => ({
      _id: record._id,
      dateOfApplication: record.date,
      nextDewormingDate: record.nextDate,
      dewormerName: record.name,
      observations: record.observations,
    }));

  const transformToMedicalVisitData = (records: any[]) =>
    records.map((record) => ({
      _id: record._id,
      visitDate: record.date,
      reasonForVisit: record.name,
      veterinarianName: record.veterinarianName,
      observations: record.observations,
    }));

  const filteredData = getFilteredData();

  const TABS = [
    {
      id: 0,
      value: 'vacunas',
      label: 'Vaccines',
      icon: 'mdi:pill-bottle',
      component: (
        <VaccinesList
          data={transformToVaccineData(filteredData)}
          onEdit={handleEditRecord}
          isLoading={isFetching}
        />
      ),
    },
    {
      id: 1,
      value: 'desparacitaciones',
      label: 'Desparacitaciones',
      icon: 'fluent:pill-16-regular',
      component: (
        <DewormingList
          data={transformToDewormingData(filteredData)}
          onEdit={handleEditRecord}
          isLoading={isFetching}
        />
      ),
    },
    {
      id: 2,
      value: 'citas',
      label: 'Vsitas Médicas',
      icon: 'solar:calendar-date-bold-duotone',
      component: (
        <MedicalVisitsList
          data={transformToMedicalVisitData(filteredData)}
          onEdit={handleEditRecord}
          isLoading={isFetching}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Alert severity="error">
            Error loading information: {error?.message}
          </Alert>
        </Card>
      </Container>
    );
  }

  return (
    <CardComponent title="Medical Control">
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => createRecord('vaccine', currentPet?.memberPetId || '')}
          startIcon={<Iconify icon="mdi:needle" />}
          disabled={!currentPet}
        >
          Agregar Vacuna
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            createRecord('deworming', currentPet?.memberPetId || '')
          }
          startIcon={<Iconify icon="fluent:pill-16-regular" />}
          disabled={!currentPet}
        >
          Agregar Desparasitación
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            createRecord('medical_visit', currentPet?.memberPetId || '')
          }
          startIcon={<Iconify icon="solar:calendar-date-bold-duotone" />}
          disabled={!currentPet}
        >
          Agregar Visita Médica
        </Button>
      </Box>

      {!currentPet && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Selecciona una mascota para gestionar sus registros médicos
        </Alert>
      )}

      <Box sx={{ my: 2 }}>
        <FilterToolbar
          filters={activeFilters}
          onFilters={handleFiltersChange}
          filterConfig={MEDICAL_RECORD_FILTER_TOOLBAR}
          dateError={dateError}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </Box>

      <MedicalRecordForm
        open={open}
        onClose={() => {
          console.log('closing');
          closeForm();
        }}
        type={currentType}
        petId={petId}
        currentRecord={currentRecord}
        refetch={refetchMedicalRecords}
        onSubmitSuccess={(data) => {
          console.log('Registro guardado:', data);
          refetchMedicalRecords();
        }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <Tab
            iconPosition="start"
            key={tab.value}
            icon={<Iconify icon={tab.icon} />}
            label={tab.label}
            value={tab.id}
            disabled={!currentPet}
          />
        ))}
      </Tabs>

      <Box sx={{ py: 3 }}>
        {isFetching ? (
          <Alert severity="info">Cargando registros médicos...</Alert>
        ) : (
          React.cloneElement(TABS[currentTab].component, {
            onEdit: handleEditRecord,
            refetchTrigger,
          })
        )}
      </Box>

      {/* Paginación */}
      {medicalRecordData?.pagination &&
        medicalRecordData.pagination.total > 0 && (
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredData.length} de{' '}
              {medicalRecordData.pagination.total} registros
            </Typography>
            <Box>
              <Button
                disabled={medicalRecordData.pagination.page <= 1}
                onClick={() =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) - 1,
                  }))
                }
              >
                Anterior
              </Button>
              <Button
                disabled={
                  medicalRecordData.pagination.page >=
                  medicalRecordData.pagination.pages
                }
                onClick={() =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        )}
    </CardComponent>
  );
}
