import * as Yup from 'yup';
import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import { HOST_API } from '@/config-global';
import { useEffect, useCallback } from 'react';
import { useRedirect } from '@/hooks/use-redirect';
import { useSnackbar } from '@/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from '@/hooks/use-translation';
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
      return isEdit ? 'Edit Vaccine' : 'Register Vaccine';
    case 'deworming':
      return isEdit ? 'Edit Deworming' : 'Register Deworming';
    case 'medical_visit':
      return isEdit
        ? 'Edit Medical Appointment'
        : 'Register Medical Appointment';
    default:
      return 'Medical Record';
  }
};

const getFieldLabels = (type: MedicalRecordType) => {
  switch (type) {
    case 'vaccine':
      return {
        dateLabel: 'Application date',
        nextDateLabel: 'Next vaccine',
        nameLabel: 'Vaccine name',
        nameOptions: COMMON_VACCINES,
      };
    case 'deworming':
      return {
        dateLabel: 'Application date',
        nextDateLabel: 'Next deworming',
        nameLabel: 'Name of the deworming agent',
        nameOptions: COMMON_DEWORMERS,
      };
    case 'medical_visit':
      return {
        dateLabel: 'Date of visit',
        nextDateLabel: 'Next date',
        nameLabel: 'Reason for the visit',
        nameOptions: VISIT_REASONS,
      };
    default:
      return {
        dateLabel: 'Date',
        nextDateLabel: 'Next date',
        nameLabel: 'Name',
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
  const { t } = useTranslation();
  // Verificar si el email está verificado
  const isEmailVerified = user?.security?.isEmailVerified || false;

  const getValidationSchema = (recordType: MedicalRecordType) => {
    const baseSchema = {
      observations: Yup.string().optional(),
      // Campos de notificaciones
      emailNotificationEnabled: Yup.boolean().optional(),
      notificationDaysBefore: Yup.number()
        .min(1, t('At least 1 day in advance'))
        .max(30, t('No more than 30 days in advance'))
        .optional(),
    };

    switch (recordType) {
      case 'vaccine':
        return Yup.object().shape({
          dateOfApplication: Yup.string().required(
            t('Application date is required')
          ),
          nextVaccineDate: Yup.string()
            .required(t('Next vaccination appointment required'))
            .test(
              'is-future',
              t(
                'The next vaccine should be available at some point in the future'
              ),
              (value) => {
                if (!value) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextDate = new Date(value);
                nextDate.setHours(0, 0, 0, 0);
                return nextDate > today;
              }
            ),
          vaccineName: Yup.string().required(t('The vaccine name is required')),
          ...baseSchema,
        });

      case 'deworming':
        return Yup.object().shape({
          dateOfApplication: Yup.string().required(
            t('Application date is required')
          ),
          nextDewormingDate: Yup.string()
            .required(t('The next deworming appointment is required'))
            .test(
              'is-future',
              'The next deworming should be scheduled for a future date',
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
            t('The name of the deworming medication is required')
          ),
          ...baseSchema,
        });

      case 'medical_visit':
        return Yup.object().shape({
          visitDate: Yup.string()
            .required(t('Date of visit is required'))
            .test(
              'is-future',
              t('The visit date must be in the future'),
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
            t('The reason for the visit is required')
          ),
          veterinarianName: Yup.string().required(
            t('The veterinarians name is required')
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
        t(
          'Debes verificar tu correo electrónico para activar las notificaciones'
        ),
        { variant: 'warning' }
      );
    }
  }, [isEmailVerified, emailNotificationEnabled, setValue, enqueueSnackbar, t]);

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
        t(
          'Las notificaciones han sido desactivadas porque tu correo no está verificado'
        ),
        { variant: 'warning' }
      );
    }

    try {
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
          ? t('Registro actualizado exitosamente')
          : t('Registro creado exitosamente'),
        { variant: 'success' }
      );

      refetch();
      onSubmitSuccess?.(data);
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error saving the record'), { variant: 'error' });
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEditMode = Boolean(currentRecord);

  const getNotificationLabel = (enabled: boolean, emailVerified: boolean) => {
    if (enabled && emailVerified) return `🔔 ${t('Notifications enabled')}`;
    if (!emailVerified) return `🔒 ${t('Check your email to activate')}`;
    return `🔕 ${t('Notifications turned off')}`;
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
        <DialogTitle>{t(getFormTitle(type, isEditMode))}</DialogTitle>

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
                label={t('Veterinarians name')}
                fullWidth
              />
            )}

            <RHFTextField
              name="observations"
              label={t('Observations')}
              multiline
              rows={3}
              fullWidth
            />

            <Divider sx={{ my: 1 }}>
              <Chip label={t('Notification Settings')} size="small" />
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
                📧 {t('Email notifications')}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                {t('Get reminders when this date is approaching')}
              </Typography>

              {/* Alerta si el email no está verificado */}
              {!isEmailVerified && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    ⚠️ {t('Email address not verified')}
                  </Typography>
                  <Typography variant="caption">
                    {t(
                      'To enable email notifications, you must first verify your email address. Please check your inbox and follow the instructions in the verification email.'
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() =>
                      redirect(`${paths.dashboard.user.account}?tab=security`)
                    }
                  >
                    {t('Verify email')}
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
                              t(
                                'You need to check your email to enable notifications'
                              ),
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
                            {t('You will receive email reminders')}
                          </Typography>
                        )}
                        {!isEmailVerified && (
                          <Typography variant="caption" color="warning.main">
                            {t('You need to verify your email address')}
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
                    ⏰ {t('Number of days notice required')}
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
                          {t(
                            'You will be notified {{days}} days before the scheduled date',
                            {
                              days: field.value || 7,
                            }
                          )}
                        </Typography>
                      </>
                    )}
                  />

                  {targetDate && estimatedNotificationDate && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        📅 {t('Notification summary:')}
                      </Typography>
                      <Typography variant="body2">
                        • {t('Event date:')}:{' '}
                        <strong>
                          {new Date(targetDate).toLocaleDateString('es-CR')}
                        </strong>
                        <br />• {t('We will notify you:')}{' '}
                        <strong>
                          {estimatedNotificationDate.toLocaleDateString(
                            'es-CR'
                          )}
                        </strong>
                        <br />• {t('Frequency: Every 3 days until the event')}
                      </Typography>
                    </Alert>
                  )}

                  {!targetDate && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        ⚠️{' '}
                        {t(
                          'Enter the event date to view the notification summary'
                        )}
                      </Typography>
                    </Alert>
                  )}

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                      💡 <strong>{t('How does it work?')}</strong>
                      <br />•{' '}
                      {t(
                        'You will receive a reminder email based on the days you have set'
                      )}
                      <br />•{' '}
                      {t(
                        'The system will send reminders every 3 days until the event date'
                      )}
                      <br />•{' '}
                      {t(
                        'You can modify these settings at any time in your profile'
                      )}
                    </Typography>
                  </Alert>
                </Box>
              )}

              {/* Mensaje de email no verificado para usuarios que ya tenían notificaciones */}
              {currentRecord?.emailNotificationEnabled && !isEmailVerified && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    ⚠️ {t('Notifications have been automatically turned off')}
                  </Typography>
                  <Typography variant="caption">
                    {t(
                      'Your email address has not been verified. Please verify your email address to reactivate notifications.'
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      redirect(`${paths.dashboard.user.account}?tab=security`)
                    }
                  >
                    {t('Verify email')}
                  </Button>
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
            {t(currentRecord ? 'Update' : 'Create')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
