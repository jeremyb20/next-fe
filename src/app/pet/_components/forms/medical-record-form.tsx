import * as Yup from 'yup';
import { endpoints } from '@/src/utils/axios';
import { useEffect, useCallback } from 'react';
import { HOST_API } from '@/src/config-global';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import { FormValues, MedicalRecordType } from '@/src/interfaces/medical-record';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// Tipos para los registros médicos

type Props = {
  open: boolean;
  onClose: VoidFunction;
  type: MedicalRecordType;
  petId: string;
  currentRecord?: any;
  refetch: () => void;
  onSubmitSuccess?: (data: FormValues) => void;
};

// Opciones predefinidas con value y label para traducciones
const COMMON_VACCINES = [
  { value: 'rabies', label: 'Rabia' },
  { value: 'parvovirus', label: 'Parvovirus' },
  { value: 'distemper', label: 'Moquillo' },
  { value: 'hepatitis', label: 'Hepatitis' },
  { value: 'leptospirosis', label: 'Leptospirosis' },
  { value: 'parainfluenza', label: 'Parainfluenza' },
  { value: 'bordetella', label: 'Bordetella' },
  { value: 'feline_leukemia', label: 'Leucemia Felina' },
  { value: 'panleukopenia', label: 'Panleucopenia' },
  { value: 'calicivirus', label: 'Calicivirus' },
  { value: 'rhinotracheitis', label: 'Rinotraqueitis' },
  { value: 'other', label: 'Otra' },
];

const COMMON_DEWORMERS = [
  { value: 'praziquantel', label: 'Praziquantel' },
  { value: 'ivermectin', label: 'Ivermectina' },
  { value: 'milbemycin', label: 'Milbemicina' },
  { value: 'selamectin', label: 'Selamectina' },
  { value: 'fipronil', label: 'Fipronil' },
  { value: 'pyrantel', label: 'Pirantel' },
  { value: 'fenbendazole', label: 'Fenbendazol' },
  { value: 'other', label: 'Otro' },
];

const VISIT_REASONS = [
  { value: 'annual_checkup', label: 'Chequeo anual' },
  { value: 'vaccination', label: 'Vacunación' },
  { value: 'deworming', label: 'Desparasitación' },
  { value: 'weight_control', label: 'Control de peso' },
  { value: 'digestive_issues', label: 'Problemas digestivos' },
  { value: 'skin_problems', label: 'Problemas de piel' },
  { value: 'injury_accident', label: 'Lesión o accidente' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'dental_care', label: 'Control dental' },
  { value: 'behavior', label: 'Comportamiento' },
  { value: 'other', label: 'Otro' },
];

// Títulos del formulario según el tipo
const getFormTitle = (type: MedicalRecordType, isEdit: boolean) => {
  switch (type) {
    case 'vaccine':
      return isEdit ? 'Editar Vacuna' : 'Registrar Vacuna';
    case 'deworming':
      return isEdit ? 'Editar Desparasitación' : 'Registrar Desparasitación';
    case 'medical_visit':
      return isEdit ? 'Editar Visita Médica' : 'Registrar Visita Médica';
    default:
      return 'Registro Médico';
  }
};

// Labels específicos para cada tipo
const getFieldLabels = (type: MedicalRecordType) => {
  switch (type) {
    case 'vaccine':
      return {
        dateLabel: 'Fecha de aplicación',
        nextDateLabel: 'Próxima vacuna',
        nameLabel: 'Nombre de la vacuna',
        nameOptions: COMMON_VACCINES,
      };
    case 'deworming':
      return {
        dateLabel: 'Fecha de aplicación',
        nextDateLabel: 'Próxima desparasitación',
        nameLabel: 'Nombre del desparasitante',
        nameOptions: COMMON_DEWORMERS,
      };
    case 'medical_visit':
      return {
        dateLabel: 'Fecha de visita',
        nextDateLabel: 'Próxima cita',
        nameLabel: 'Motivo de la visita',
        nameOptions: VISIT_REASONS,
      };
    default:
      return {
        dateLabel: 'Fecha',
        nextDateLabel: 'Próxima fecha',
        nameLabel: 'Nombre',
        nameOptions: [],
      };
  }
};

export default function MedicalRecordForm({
  open,
  onClose,
  type,
  petId,
  currentRecord,
  refetch,
  onSubmitSuccess,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();

  // Esquemas de validación específicos para cada tipo
  const getValidationSchema = (recordType: MedicalRecordType) => {
    const baseSchema = {
      observations: Yup.string().optional(),
    };

    switch (recordType) {
      case 'vaccine':
        return Yup.object().shape({
          dateOfApplication: Yup.string().required(
            'Fecha de aplicación es requerida'
          ),
          nextVaccineDate: Yup.string().required(
            'Próxima fecha de vacuna es requerida'
          ),
          vaccineName: Yup.string().required(
            'Nombre de la vacuna es requerido'
          ),
          ...baseSchema,
        });

      case 'deworming':
        return Yup.object().shape({
          dateOfApplication: Yup.string().required(
            'Fecha de aplicación es requerida'
          ),
          nextDewormingDate: Yup.string().required(
            'Próxima fecha de desparasitación es requerida'
          ),
          dewormerName: Yup.string().required(
            'Nombre del desparasitante es requerido'
          ),
          ...baseSchema,
        });

      case 'medical_visit':
        return Yup.object().shape({
          visitDate: Yup.string().required('Fecha de visita es requerida'),
          reasonForVisit: Yup.string().required(
            'Motivo de la visita es requerido'
          ),
          veterinarianName: Yup.string().required(
            'Nombre del veterinario es requerido'
          ),
          ...baseSchema,
        });

      default:
        return Yup.object().shape({});
    }
  };

  const getDefaultValues = useCallback((): FormValues => {
    if (currentRecord) {
      switch (type) {
        case 'vaccine':
          return {
            dateOfApplication: currentRecord.dateOfApplication || '',
            nextVaccineDate: currentRecord.nextVaccineDate || '',
            vaccineName: currentRecord.vaccineName || '',
            observations: currentRecord.observations || '',
          };
        case 'deworming':
          return {
            dateOfApplication: currentRecord.dateOfApplication || '',
            nextDewormingDate: currentRecord.nextDewormingDate || '',
            dewormerName: currentRecord.dewormerName || '',
            observations: currentRecord.observations || '',
          };
        case 'medical_visit':
          return {
            visitDate: currentRecord.visitDate || '',
            reasonForVisit: currentRecord.reasonForVisit || '',
            veterinarianName: currentRecord.veterinarianName || '',
            observations: currentRecord.observations || '',
          };
        default:
          return {
            visitDate: currentRecord.visitDate || '',
            reasonForVisit: currentRecord.reasonForVisit || '',
            veterinarianName: currentRecord.veterinarianName || '',
            observations: currentRecord.observations || '',
          };
      }
    }

    // Valores por defecto para nuevo registro
    switch (type) {
      case 'vaccine':
        return {
          dateOfApplication: '',
          nextVaccineDate: '',
          vaccineName: '',
          observations: '',
        };
      case 'deworming':
        return {
          dateOfApplication: '',
          nextDewormingDate: '',
          dewormerName: '',
          observations: '',
        };
      case 'medical_visit':
        return {
          visitDate: '',
          reasonForVisit: '',
          veterinarianName: '',
          observations: '',
        };
      default:
        return {
          visitDate: '',
          reasonForVisit: '',
          veterinarianName: '',
          observations: '',
        };
    }
  }, [currentRecord, type]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(getValidationSchema(type)) as any,
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Efecto para resetear el formulario cuando cambia currentRecord o se abre/cierra
  useEffect(() => {
    if (open) {
      reset(getDefaultValues());
    }
  }, [open, reset, getDefaultValues]);

  const fieldLabels = getFieldLabels(type);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Datos del registro médico:', {
        petId,
        type,
        data,
      });

      const payloadData = {
        data,
        petId,
        type,
        ...(currentRecord && { recordId: currentRecord._id }),
      };

      await mutateAsync<any>({
        payload: payloadData as any,
        pEndpoint: currentRecord?._id
          ? `${HOST_API}${endpoints.pet.updateMedicalRecord}`
          : `${HOST_API}${endpoints.pet.createMedicalRecord}`,
        method: currentRecord?._id ? 'PUT' : 'POST',
      });

      enqueueSnackbar(
        currentRecord
          ? 'Registro actualizado exitosamente'
          : 'Registro creado exitosamente',
        { variant: 'success' }
      );

      refetch();
      onSubmitSuccess?.(data);
      onClose();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al guardar el registro', { variant: 'error' });
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEditMode = Boolean(currentRecord);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{getFormTitle(type, isEditMode)}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
            }}
            sx={{ mt: 1 }}
          >
            {/* Fecha principal según el tipo */}
            <Controller
              name={
                type === 'medical_visit' ? 'visitDate' : 'dateOfApplication'
              }
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label={fieldLabels.dateLabel}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.toISOString() : '');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />

            {/* Fecha próxima (no aplica para visitas médicas) */}
            {(type === 'vaccine' || type === 'deworming') && (
              <Controller
                name={
                  type === 'vaccine' ? 'nextVaccineDate' : 'nextDewormingDate'
                }
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={fieldLabels.nextDateLabel}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.toISOString() : '');
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            )}

            {/* Campo de nombre según el tipo */}
            {type === 'medical_visit' ? (
              <RHFSelect name="reasonForVisit" label={fieldLabels.nameLabel}>
                {fieldLabels.nameOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            ) : (
              <RHFAutocomplete
                name={type === 'vaccine' ? 'vaccineName' : 'dewormerName'}
                label={fieldLabels.nameLabel}
                options={fieldLabels.nameOptions.map((option) => option.label)}
                freeSolo
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            )}

            {/* Veterinario solo para visitas médicas */}
            {type === 'medical_visit' && (
              <RHFTextField
                name="veterinarianName"
                label="Nombre del veterinario"
                fullWidth
              />
            )}

            {/* Observaciones */}
            <RHFTextField
              name="observations"
              label="Observaciones"
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {currentRecord ? 'Actualizar' : 'Crear'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
