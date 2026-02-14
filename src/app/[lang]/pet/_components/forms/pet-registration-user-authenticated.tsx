'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { endpoints } from '@/src/utils/axios';
import { useTranslation } from 'react-i18next';
import { OptionType } from '@/src/types/global';
import { useAuthContext } from '@/src/auth/hooks';
import { fData } from '@/src/utils/format-number';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
import { HOST_API, PATH_AFTER_LOGIN } from '@/src/config-global';
import UploadAvatar from '@/src/components/upload/upload-avatar';
import { PetAgeCalculator } from '@/src/utils/pet-age-calculator';
import { BreedOptions, GENDER_OPTIONS } from '@/src/utils/constants';
import useCelebrationConfetti from '@/src/hooks/use-celebration-confetti';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import {
  getDogSizeFromBreed,
  getSpeciesFromBreed,
} from '@/src/utils/pet-utils';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Card,
  MenuItem,
  CardHeader,
  ButtonGroup,
  CardContent,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface PetRegistrationUserAuthenticatedProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PetRegistrationUserAuthenticated({
  onSuccess,
  onCancel,
}: PetRegistrationUserAuthenticatedProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext(); // Obtener usuario actual
  const { mutateAsync } = useCreateGenericMutation();
  const { celebrate } = useCelebrationConfetti();
  const { t } = useTranslation();

  const [errorMsg, setErrorMsg] = useState('');
  const [ageResult, setAgeResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);

  const router = useRouter();

  // Esquema de validación para la mascota
  const PetSchema = Yup.object().shape({
    petName: Yup.string().required(t('Pet name is required')),
    breed: Yup.string().required(t('Breed is required')),
    genderSelected: Yup.string().required(t('Gender is required')),
    birthDate: Yup.string().optional(),
    favoriteActivities: Yup.string().optional(),
    healthAndRequirements: Yup.string().optional(),
    weight: Yup.string().optional(),
  });

  // Función para manejar la subida de foto
  const handleDropPetPhoto = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setPetPhoto(newFile);
      // Crear preview para mostrar
      const previewUrl = URL.createObjectURL(newFile);
      setPetPhotoPreview(previewUrl);
    }
  }, []);

  // Función para eliminar la foto
  const handleRemovePetPhoto = useCallback(() => {
    setPetPhoto(null);
    if (petPhotoPreview) {
      URL.revokeObjectURL(petPhotoPreview);
    }
    setPetPhotoPreview(null);
  }, [petPhotoPreview]);

  // Formulario para mascota
  const petMethods = useForm({
    resolver: yupResolver(PetSchema),
    defaultValues: {
      petName: '',
      breed: '',
      genderSelected: '',
      birthDate: '',
      weight: '',
      favoriteActivities: '',
      healthAndRequirements: '',
    },
  });

  const {
    handleSubmit: handlePetSubmit,
    setValue: setPetValue,
    control,
    watch: watchPetForm,
    formState: { isSubmitting: isPetSubmitting },
  } = petMethods;

  const handleWeightUnitChange = (unit: 'kg' | 'lb') => {
    setWeightUnit(unit);
  };

  // Función para calcular la edad de la mascota
  const calculatePetAge = useCallback(
    (birthDate: string, breedValue?: string) => {
      if (!birthDate) {
        setAgeResult(null);
        setRecommendations([]);
        return;
      }

      try {
        let species: 'dog' | 'cat' = 'dog';
        let size: 'small' | 'medium' | 'large' | undefined;

        if (breedValue) {
          const detectedSpecies = getSpeciesFromBreed(breedValue);
          if (detectedSpecies) {
            species = detectedSpecies;
            if (detectedSpecies === 'dog') {
              size = getDogSizeFromBreed(breedValue) || undefined;
            }
          }
        }

        const result = PetAgeCalculator.calculateAge(birthDate, {
          species,
          size,
        });

        setAgeResult({
          ...result,
          species,
          size,
        });
        setRecommendations(PetAgeCalculator.getAgeRecommendations(result));
      } catch (error) {
        console.error('Error calculando edad:', error);
        setAgeResult(null);
        setRecommendations([]);
      }
    },
    []
  );

  // Función para enviar el formulario
  const onSubmit = handlePetSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const weightWithUnit = data.weight ? `${data.weight} ${weightUnit}` : '';

      await mutateAsync<any>({
        payload: {
          petData: {
            ...data,
            weight: weightWithUnit,
          },
          userId: user?._id || '',
          image: petPhoto,
        } as any,
        pEndpoint: `${HOST_API}${endpoints.user.addPetToAuthenticatedUser}`,
        method: 'POST',
        isFormData: !!petPhoto,
      });

      celebrate({
        type: 'celebration',
        customOptions: {
          particleCount: 250,
          spread: 80,
        },
      });

      enqueueSnackbar(t('Pet added to your account successfully'), {
        variant: 'success',
      });

      // Resetear formulario
      petMethods.reset();
      if (petPhotoPreview) {
        URL.revokeObjectURL(petPhotoPreview);
      }
      setPetPhoto(null);
      setPetPhotoPreview(null);
      setAgeResult(null);
      setRecommendations([]);

      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirigir a dashboard o página principal
        router.push(PATH_AFTER_LOGIN);
      }

      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Error adding pet:', error);
      setErrorMsg(t(error.message || 'Error adding pet to your account'));
      enqueueSnackbar(t(error.message || 'Error adding pet to your account'), {
        variant: 'error',
      });
      setIsSubmitting(false);
    }
  });

  const goToDashboard = () => {
    router.push(PATH_AFTER_LOGIN);
  };

  // Efecto para calcular edad cuando cambia la raza o fecha de nacimiento
  useEffect(() => {
    const currentBreed = watchPetForm('breed');
    const currentBirthDate = watchPetForm('birthDate');

    if (currentBirthDate && currentBreed) {
      calculatePetAge(currentBirthDate, currentBreed);
    }
  }, [calculatePetAge, watchPetForm]);

  return (
    <Box>
      {/* Mostrar información del usuario actual */}
      {user && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('Adding a new pet to your account')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Logged in as')}: <strong>{user.email}</strong>
          </Typography>
        </Paper>
      )}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t(errorMsg)}
        </Alert>
      )}

      <FormProvider methods={petMethods} onSubmit={onSubmit}>
        {/* Sección de Foto de la Mascota */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title={t('Pet Photo (Optional)')} />
          <CardContent>
            <UploadAvatar
              file={petPhotoPreview}
              onDrop={handleDropPetPhoto}
              onDelete={handleRemovePetPhoto}
              validator={(fileData) => {
                // Validar tipo de archivo
                const allowedTypes = [
                  'image/jpeg',
                  'image/jpg',
                  'image/png',
                  'image/gif',
                ];
                if (!allowedTypes.includes(fileData.type)) {
                  return {
                    code: 'invalid-file-type',
                    message: t('Only JPEG, JPG, PNG or GIF images are allowed'),
                  };
                }

                // Validar tamaño (2MB máximo)
                if (fileData.size > 2 * 1024 * 1024) {
                  return {
                    code: 'file-too-large',
                    message: `${t('Image is too large. Maximum')} ${fData(
                      2 * 1024 * 1024
                    )}`,
                  };
                }

                return null;
              }}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {t('Allowed *.jpeg, *.jpg, *.png, *.gif')}
                  <br /> {t('max size of')} {fData(2 * 1024 * 1024)}
                </Typography>
              }
            />
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            mb: 3,
          }}
        >
          <RHFTextField name="petName" label={t('Pet Name')} />

          <RHFAutocomplete
            name="breed"
            label={t('Breed')}
            options={BreedOptions.todos}
            getOptionLabel={(option: OptionType | string) => {
              if (typeof option === 'string') {
                const foundOption = BreedOptions.todos.find(
                  (opt) => opt.value === option
                );
                return foundOption ? foundOption.label : option;
              }
              return option.label;
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof value === 'string') {
                return option.value === value;
              }
              return option.value === value?.value;
            }}
            onChange={(event, newValue) => {
              let stringValue = '';
              if (newValue) {
                if (typeof newValue === 'string') {
                  stringValue = newValue;
                } else if (
                  typeof newValue === 'object' &&
                  'value' in newValue
                ) {
                  stringValue = newValue.value;
                }
              }
              setPetValue('breed', stringValue, { shouldValidate: true });
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {t(option.label)}
              </li>
            )}
          />

          <RHFSelect name="genderSelected" label={t('Gender')}>
            {GENDER_OPTIONS.map((gender) => (
              <MenuItem key={gender.value} value={gender.value}>
                {t(gender.label)}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField
            name="weight"
            label={t('Weight')}
            type="number"
            inputProps={{ step: '0.1' }}
            InputProps={{
              endAdornment: (
                <ButtonGroup
                  variant="outlined"
                  aria-label="Weight unit selector"
                  size="small"
                >
                  <Button
                    onClick={() => handleWeightUnitChange('kg')}
                    variant={weightUnit === 'kg' ? 'contained' : 'outlined'}
                  >
                    kg
                  </Button>
                  <Button
                    onClick={() => handleWeightUnitChange('lb')}
                    variant={weightUnit === 'lb' ? 'contained' : 'outlined'}
                  >
                    lb
                  </Button>
                </ButtonGroup>
              ),
            }}
          />

          <Controller
            name="birthDate"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const currentBreed = watchPetForm('breed');

              return (
                <DatePicker
                  views={['year', 'month', 'day']}
                  label={t('Birth Date')}
                  minDate={new Date('2000-03-01')}
                  maxDate={new Date()}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.toISOString() : '');
                    if (newValue) {
                      calculatePetAge(newValue.toISOString(), currentBreed);
                    } else {
                      setAgeResult(null);
                      setRecommendations([]);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              );
            }}
          />
        </Box>

        {/* Mostrar resultado de edad */}
        {ageResult && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('Pet Age Information')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('Species')}:</strong>{' '}
              {ageResult.species === 'dog' ? 'Dog' : 'Cat'}
              {ageResult.size &&
                ageResult.species === 'dog' &&
                ` (${ageResult.size})`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ageResult.years} {t('years and')} {ageResult.months}{' '}
              {t('months')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t(ageResult.description)}
            </Typography>

            {recommendations.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('Recommendations')}:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body2">{t(rec)}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        )}

        <RHFTextField
          name="favoriteActivities"
          label={t('Favorite Activities')}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <RHFTextField
          name="healthAndRequirements"
          label={t('Health & Requirements')}
          multiline
          rows={2}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {onCancel ? (
            <Button onClick={onCancel} variant="outlined">
              {t('Cancel')}
            </Button>
          ) : (
            <Button onClick={goToDashboard} variant="outlined">
              {t('Back to Dashboard')}
            </Button>
          )}

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || isPetSubmitting}
          >
            {t('Add New Pet')}
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
}
