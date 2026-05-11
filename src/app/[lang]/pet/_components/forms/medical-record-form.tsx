import * as Yup from 'yup';
import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import { HOST_API } from '@/config-global';
import { useEffect, useCallback } from 'react';
import { useRedirect } from '@/hooks/use-redirect';
import { useSnackbar } from '@/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useManagerUser } from '@/hooks/use-manager-user';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';
import { FormValues, MedicalRecordType } from '@/interfaces/medical-record';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from '@/components/hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Chip,
  Alert,
  Switch,
  Slider,
  Divider,
  Typography,
  FormControlLabel,
} from '@mui/material';

// ----------------------------------------------------------------------

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
  const { user } = useManagerUser();
  const { redirect } = useRedirect();
  // Verificar si el email está verificado
  const isEmailVerified = user?.security?.isEmailVerified || false;

  const getValidationSchema = (recordType: MedicalRecordType) => {
    const baseSchema = {
      observations: Yup.string().optional(),
      // Campos de notificaciones
      emailNotificationEnabled: Yup.boolean().optional(),
      notificationDaysBefore: Yup.number()
        .min(1, 'Mínimo 1 día de anticipación')
        .max(30, 'Máximo 30 días de anticipación')
        .optional(),
    };

    switch (recordType) {
      case 'vaccine':
        return Yup.object().shape({
          dateOfApplication: Yup.string().required(
            'Fecha de aplicación es requerida'
          ),
          nextVaccineDate: Yup.string()
            .required('Próxima fecha de vacuna es requerida')
            .test(
              'is-future',
              'La próxima vacuna debe ser una fecha futura',
              (value) => {
                if (!value) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextDate = new Date(value);
                nextDate.setHours(0, 0, 0, 0);
                return nextDate > today;
              }
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
          nextDewormingDate: Yup.string()
            .required('Próxima fecha de desparasitación es requerida')
            .test(
              'is-future',
              'La próxima desparasitación debe ser una fecha futura',
              (value) => {
                if (!value) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextDate = new Date(value);
                nextDate.setHours(0, 0, 0, 0);
                return nextDate > today;
              }
            ),
          dewormerName: Yup.string().required(
            'Nombre del desparasitante es requerido'
          ),
          ...baseSchema,
        });

      case 'medical_visit':
        return Yup.object().shape({
          visitDate: Yup.string()
            .required('Fecha de visita es requerida')
            .test(
              'is-future',
              'La fecha de visita debe ser futura',
              (value) => {
                if (!value) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const visitDate = new Date(value);
                visitDate.setHours(0, 0, 0, 0);
                return visitDate > today;
              }
            ),
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
    const baseNotificationValues = {
      emailNotificationEnabled:
        currentRecord?.emailNotificationEnabled || false,
      notificationDaysBefore: currentRecord?.notificationDaysBefore || 7,
    };

    if (currentRecord) {
      switch (type) {
        case 'vaccine':
          return {
            dateOfApplication: currentRecord.dateOfApplication || '',
            nextVaccineDate: currentRecord.nextVaccineDate || '',
            vaccineName: currentRecord.vaccineName || '',
            observations: currentRecord.observations || '',
            ...baseNotificationValues,
          };
        case 'deworming':
          return {
            dateOfApplication: currentRecord.dateOfApplication || '',
            nextDewormingDate: currentRecord.nextDewormingDate || '',
            dewormerName: currentRecord.dewormerName || '',
            observations: currentRecord.observations || '',
            ...baseNotificationValues,
          };
        case 'medical_visit':
          return {
            visitDate: currentRecord.visitDate || '',
            reasonForVisit: currentRecord.reasonForVisit || '',
            veterinarianName: currentRecord.veterinarianName || '',
            observations: currentRecord.observations || '',
            ...baseNotificationValues,
          };
        default:
          return {
            visitDate: currentRecord.visitDate || '',
            reasonForVisit: currentRecord.reasonForVisit || '',
            veterinarianName: currentRecord.veterinarianName || '',
            observations: currentRecord.observations || '',
            ...baseNotificationValues,
          };
      }
    }

    const defaultNotificationValues = {
      emailNotificationEnabled: false,
      notificationDaysBefore: 7,
    };

    switch (type) {
      case 'vaccine':
        return {
          dateOfApplication: '',
          nextVaccineDate: '',
          vaccineName: '',
          observations: '',
          ...defaultNotificationValues,
        };
      case 'deworming':
        return {
          dateOfApplication: '',
          nextDewormingDate: '',
          dewormerName: '',
          observations: '',
          ...defaultNotificationValues,
        };
      case 'medical_visit':
        return {
          visitDate: '',
          reasonForVisit: '',
          veterinarianName: '',
          observations: '',
          ...defaultNotificationValues,
        };
      default:
        return {
          visitDate: '',
          reasonForVisit: '',
          veterinarianName: '',
          observations: '',
          ...defaultNotificationValues,
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
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const emailNotificationEnabled = watch('emailNotificationEnabled');

  // Si el email no está verificado y se intenta activar, desactivar automáticamente
  useEffect(() => {
    if (!isEmailVerified && emailNotificationEnabled) {
      setValue('emailNotificationEnabled', false);
      enqueueSnackbar(
        'Debes verificar tu correo electrónico para activar las notificaciones',
        { variant: 'warning' }
      );
    }
  }, [isEmailVerified, emailNotificationEnabled, setValue, enqueueSnackbar]);

  useEffect(() => {
    if (open) {
      reset(getDefaultValues());
    }
  }, [open, reset, getDefaultValues]);

  const fieldLabels = getFieldLabels(type);

  const onSubmit = handleSubmit(async (data) => {
    // Si el email no está verificado, asegurar que las notificaciones estén desactivadas
    if (!isEmailVerified && data.emailNotificationEnabled) {
      data.emailNotificationEnabled = false;
      enqueueSnackbar(
        'Las notificaciones han sido desactivadas porque tu correo no está verificado',
        { variant: 'warning' }
      );
    }

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

  const getNotificationLabel = (enabled: boolean, emailVerified: boolean) => {
    if (enabled && emailVerified) return '🔔 Notificaciones activadas';
    if (!emailVerified) return '🔒 Verifica tu email para activar';
    return '🔕 Notificaciones desactivadas';
  };

  const getTargetDate = () => {
    if (type === 'medical_visit') {
      return watch('visitDate');
    }
    if (type === 'vaccine') {
      return watch('nextVaccineDate');
    }
    if (type === 'deworming') {
      return watch('nextDewormingDate');
    }
    return null;
  };

  const targetDate = getTargetDate();
  const notificationDays = watch('notificationDaysBefore') || 7;

  const getEstimatedNotificationDate = () => {
    if (!targetDate) return null;
    const date = new Date(targetDate);
    date.setDate(date.getDate() - notificationDays);
    return date;
  };

  const estimatedNotificationDate = getEstimatedNotificationDate();

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

            {type === 'medical_visit' && (
              <RHFTextField
                name="veterinarianName"
                label="Nombre del veterinario"
                fullWidth
              />
            )}

            <RHFTextField
              name="observations"
              label="Observaciones"
              multiline
              rows={3}
              fullWidth
            />

            <Divider sx={{ my: 1 }}>
              <Chip label="Configuración de Notificaciones" size="small" />
            </Divider>

            <Box
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                📧 Notificaciones por correo electrónico
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Recibe recordatorios cuando esta fecha esté próxima a vencer
              </Typography>

              {/* Alerta si el email no está verificado */}
              {!isEmailVerified && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    ⚠️ Correo electrónico no verificado
                  </Typography>
                  <Typography variant="caption">
                    Para activar las notificaciones por email, primero debes
                    verificar tu dirección de correo electrónico. Por favor,
                    revisa tu bandeja de entrada y sigue las instrucciones del
                    correo de verificación.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      redirect(`${paths.dashboard.user.account}?tab=security`)
                    }
                  >
                    Verificar correo
                  </Button>
                </Alert>
              )}

              <Controller
                name="emailNotificationEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value && isEmailVerified}
                        onChange={(e) => {
                          if (!isEmailVerified) {
                            enqueueSnackbar(
                              'Debes verificar tu correo electrónico para activar las notificaciones',
                              { variant: 'warning' }
                            );
                            return;
                          }
                          field.onChange(e.target.checked);
                        }}
                        color="primary"
                        disabled={!isEmailVerified}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          {getNotificationLabel(field.value, isEmailVerified)}
                        </Typography>
                        {field.value && isEmailVerified && (
                          <Typography variant="caption" color="success.main">
                            Recibirás recordatorios por email
                          </Typography>
                        )}
                        {!isEmailVerified && (
                          <Typography variant="caption" color="warning.main">
                            Necesitas verificar tu correo electrónico
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{ mb: 2, width: '100%', alignItems: 'flex-start' }}
                  />
                )}
              />

              {emailNotificationEnabled && isEmailVerified && (
                <Box sx={{ mt: 2, pl: 2, pr: 2 }}>
                  <Typography gutterBottom variant="body2">
                    ⏰ Días de anticipación para notificar
                  </Typography>

                  <Controller
                    name="notificationDaysBefore"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Slider
                          value={field.value || 7}
                          onChange={(_, value) => field.onChange(value)}
                          min={1}
                          max={30}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value} días`}
                          marks={[
                            { value: 1, label: '1 día' },
                            { value: 7, label: '7 días' },
                            { value: 14, label: '14 días' },
                            { value: 30, label: '30 días' },
                          ]}
                          sx={{ mt: 2, mb: 3 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 2 }}
                        >
                          Recibirás una notificación {field.value || 7} días
                          antes de la fecha programada
                        </Typography>
                      </>
                    )}
                  />

                  {targetDate && estimatedNotificationDate && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        📅 Resumen de notificaciones:
                      </Typography>
                      <Typography variant="body2">
                        • Fecha del evento:{' '}
                        <strong>
                          {new Date(targetDate).toLocaleDateString('es-CR')}
                        </strong>
                        <br />• Te notificaremos:{' '}
                        <strong>
                          {estimatedNotificationDate.toLocaleDateString(
                            'es-CR'
                          )}
                        </strong>
                        <br />• Frecuencia: Cada 3 días hasta el evento
                      </Typography>
                    </Alert>
                  )}

                  {!targetDate && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        ⚠️ Completa la fecha del evento para ver el resumen de
                        notificaciones
                      </Typography>
                    </Alert>
                  )}

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                      💡 <strong>¿Cómo funciona?</strong>
                      <br />
                      • Recibirás un correo de recordatorio según los días
                      configurados
                      <br />
                      • Si no se realiza la acción, recibirás recordatorios cada
                      3 días
                      <br />• Puedes desactivar esta opción en cualquier momento
                      editando el registro
                    </Typography>
                  </Alert>
                </Box>
              )}

              {/* Mensaje de email no verificado para usuarios que ya tenían notificaciones */}
              {currentRecord?.emailNotificationEnabled && !isEmailVerified && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    ⚠️ Las notificaciones han sido desactivadas automáticamente
                  </Typography>
                  <Typography variant="caption">
                    Tu correo electrónico no está verificado. Por favor,
                    verifica tu email para volver a activar las notificaciones.
                  </Typography>
                </Alert>
              )}
            </Box>
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
