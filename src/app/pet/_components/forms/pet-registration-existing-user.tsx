// components/pet-registration-existing-user.tsx

'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { endpoints } from '@/src/utils/axios';
import Iconify from '@/src/components/iconify';
import { OptionType } from '@/src/types/global';
import { useAuthContext } from '@/src/auth/hooks';
import { fData } from '@/src/utils/format-number';
import { useBoolean } from '@/src/hooks/use-boolean';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
import { getValidationCode } from '@/src/hooks/use-fetch';
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
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import { alpha } from '@mui/material/styles';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import StepContent from '@mui/material/StepContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Card,
  MenuItem,
  IconButton,
  CardHeader,
  ButtonGroup,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// Esquema de validación para el código - 6 dígitos
const CodeSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .length(6, 'Code must be exactly 6 characters')
    .matches(/^[0-9a-zA-Z]+$/, 'Code must contain only letters and numbers'),
});

// Esquema de validación para login
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Esquema de validación para la mascota
const PetSchema = Yup.object().shape({
  petName: Yup.string().required('Pet name is required'),
  breed: Yup.string().required('Breed is required'),
  genderSelected: Yup.string().required('Gender is required'),
  birthDate: Yup.string().optional(),
  favoriteActivities: Yup.string().optional(),
  healthAndRequirements: Yup.string().optional(),
  weight: Yup.string().optional(),
});

const steps = [
  {
    label: 'Code Validation',
    description: 'Enter your 6-digit invitation code to start the registration',
  },
  {
    label: 'Sign In',
    description: 'Sign in to your existing account',
  },
  {
    label: 'Pet Information',
    description: "Add your pet's basic information",
  },
  {
    label: 'Preview & Confirm',
    description: 'Review all information before completing registration',
  },
];

interface PetRegistrationExistingUserProps {
  code?: string;
  onBackToSelection?: () => void;
}

export function PetRegistrationExistingUser({
  code,
  onBackToSelection,
}: PetRegistrationExistingUserProps) {
  const password = useBoolean();
  const router = useRouter();
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();
  const { celebrate } = useCelebrationConfetti();

  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [petData, setPetData] = useState<any>(null);
  const [ageResult, setAgeResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [validatedCode, setValidatedCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);

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

  // Formulario para código
  const codeMethods = useForm({
    resolver: yupResolver(CodeSchema),
    defaultValues: {
      code: code || '',
    },
  });

  // Formulario para login
  const loginMethods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
    handleSubmit: handleCodeSubmit,
    watch: watchCode,
    formState: { isSubmitting: isCodeSubmitting },
  } = codeMethods;

  const {
    handleSubmit: handleLoginSubmit,
    formState: { isSubmitting: isLoginSubmitting },
  } = loginMethods;

  const {
    handleSubmit: handlePetSubmit,
    setValue: setPetValue,
    control,
    watch: watchPetForm,
    formState: { isSubmitting: isPetSubmitting },
  } = petMethods;

  const watchCodeValue = watchCode('code');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  // Paso 1: Validación del código
  const onCodeSubmit = handleCodeSubmit(async (data) => {
    try {
      setErrorMsg('');

      const { data: res, error, isError } = await getValidationCode(data.code);

      console.log('Full validation response:', { res, error, isError });

      if (isError) {
        setErrorMsg(error?.message || 'Network error. Please try again.');
        return;
      }

      if (!res) {
        setErrorMsg('No response from server. Please try again.');
        return;
      }

      setValidatedCode(data.code);
      setErrorMsg('');
      handleNext();
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setErrorMsg(
        error.message || 'An unexpected error occurred. Please try again.'
      );
    }
  });

  // Paso 2: Login
  const onLoginSubmit = handleLoginSubmit(async (data) => {
    try {
      setErrorMsg('');
      await login?.(data.email, data.password);
      setUserData(data);
      handleNext();
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Invalid email or password');
    }
  });

  // Paso 3: Información de la mascota
  const onPetSubmit = handlePetSubmit(async (data) => {
    try {
      //   setPetData(data);
      setPetData({
        ...data,
        photo: petPhoto, // Incluir el archivo de la foto
      });
      handleNext();
    } catch (error) {
      console.error(error);
      setErrorMsg('Error saving pet information');
    }
  });

  // Paso 4: Confirmación y registro completo
  const handleCompleteRegistration = async () => {
    try {
      setIsSubmitting(true);

      const weightWithUnit = petData.weight
        ? `${petData.weight} ${weightUnit}`
        : '';
      await mutateAsync<any>({
        payload: {
          code: validatedCode,
          userCredentials: userData,
          petData: {
            ...petData,
            weight: weightWithUnit,
          },
          image: petPhoto,
        } as any,
        pEndpoint: `${HOST_API}${endpoints.user.addPetToExistingUser}`,
        method: 'POST',
        isFormData: !!petPhoto,
      });

      setErrorMsg('');
      celebrate({
        type: 'celebration',
        customOptions: {
          particleCount: 250,
          spread: 80,
        },
      });
      enqueueSnackbar('Pet added to your account successfully', {
        variant: 'success',
      });
      setIsSubmitting(false);
      setActiveStep(4);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Error completing registration');
      enqueueSnackbar(error.message || 'Error completing registration', {
        variant: 'error',
      });
    }
  };

  const goToLogin = () => {
    router.push(PATH_AFTER_LOGIN);
  };

  // Renderizar paso de validación de código
  const renderCodeStep = () => (
    <FormProvider methods={codeMethods} onSubmit={onCodeSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3 }}>
          Please enter your 6-digit invitation code to start the registration
          process.
        </Typography>

        <RHFTextField
          name="code"
          label="Invitation Code"
          placeholder="Enter 6-digit code"
          autoComplete="off"
          autoFocus
          inputProps={{
            maxLength: 6,
          }}
        />

        <Box sx={{ mt: 3 }}>
          <Button onClick={onBackToSelection} sx={{ mr: 1 }}>
            Back
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isCodeSubmitting}
            disabled={!watchCodeValue || watchCodeValue.length !== 6}
          >
            Validate Code
          </LoadingButton>
        </Box>

        {code && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Code provided: {code}
          </Typography>
        )}
      </Box>
    </FormProvider>
  );

  // Renderizar paso de login
  const renderLoginStep = () => (
    <FormProvider methods={loginMethods} onSubmit={onLoginSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3, color: 'success.main' }}>
          ✓ Code validated successfully
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Please sign in to your account to add a new pet.
        </Typography>

        <RHFTextField name="email" label="Email address" sx={{ mb: 2 }} />

        <RHFTextField
          name="password"
          label="Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? 'solar:eye-bold'
                        : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoginSubmitting}
          >
            Sign In
          </LoadingButton>
        </Box>
      </Box>
    </FormProvider>
  );

  // Renderizar paso de información de mascota
  const renderPetStep = () => (
    <FormProvider methods={petMethods} onSubmit={onPetSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3, color: 'success.main' }}>
          ✓ Signed in as {userData?.email}
        </Typography>

        {/* Sección de Foto de la Mascota */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Pet Photo (Optional)" />
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
                    message: 'Only JPEG, JPG, PNG or GIF images are allowed',
                  };
                }

                // Validar tamaño (2MB máximo)
                if (fileData.size > 2 * 1024 * 1024) {
                  return {
                    code: 'file-too-large',
                    message: `Image is too large. Maximum ${fData(
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(2 * 1024 * 1024)}
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
          }}
        >
          <RHFTextField name="petName" label="Pet Name" />
          <RHFAutocomplete
            name="breed"
            label="Raza de la mascota"
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
                {option.label}
              </li>
            )}
          />
          <RHFSelect name="genderSelected" label="Gender">
            {GENDER_OPTIONS.map((gender) => (
              <MenuItem key={gender.value} value={gender.value}>
                {gender.label}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField
            name="weight"
            label="Weight"
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
                  label="Birth Date"
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
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Edad de la Mascota
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Especie:</strong>{' '}
              {ageResult.species === 'dog' ? 'Perro' : 'Gato'}
              {ageResult.size &&
                ageResult.species === 'dog' &&
                ` (${ageResult.size})`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ageResult.years} años y {ageResult.months} meses
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {ageResult.description}
            </Typography>

            {recommendations.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recomendaciones:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body2">{rec}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        )}

        <RHFTextField
          name="favoriteActivities"
          label="Favorite Activities"
          multiline
          rows={2}
          sx={{ mt: 2 }}
        />
        <RHFTextField
          name="healthAndRequirements"
          label="Health & Requirements"
          multiline
          rows={2}
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 3 }}>
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isPetSubmitting}
          >
            Continue
          </LoadingButton>
        </Box>
      </Box>
    </FormProvider>
  );

  // Renderizar paso de preview
  const renderPreviewStep = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          Code Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Invitation Code:</strong> {validatedCode}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {userData?.email}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          Pet Information
        </Typography>
        {/* Mostrar preview de la foto si existe */}
        {petPhotoPreview && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" gutterBottom>
              Pet Photo:
            </Typography>
            <Box
              component="img"
              src={petPhotoPreview}
              alt="Pet preview"
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                border: (theme) => `2px solid ${theme.palette.divider}`,
              }}
            />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          <strong>Name:</strong> {petData?.petName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Breed:</strong> {petData?.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Gender:</strong> {petData?.genderSelected}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Weight:</strong> {petData?.weight} {weightUnit}
        </Typography>
        {petData?.birthDate && (
          <Typography variant="body2" color="text.secondary">
            <strong>Birth Date:</strong>{' '}
            {new Date(petData.birthDate).toLocaleDateString()}
          </Typography>
        )}
        {petData?.favoriteActivities && (
          <Typography variant="body2" color="text.secondary">
            <strong>Favorite Activities:</strong> {petData.favoriteActivities}
          </Typography>
        )}
        {petData?.healthAndRequirements && (
          <Typography variant="body2" color="text.secondary">
            <strong>Health & Requirements:</strong>{' '}
            {petData.healthAndRequirements}
          </Typography>
        )}
      </Paper>

      {ageResult && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Edad de la Mascota
          </Typography>
          <Typography variant="body2">
            <strong>Edad humana:</strong> {ageResult.humanYears} años
          </Typography>
          <Typography variant="body2">
            <strong>Edad de mascota:</strong> {ageResult.petYears} años
          </Typography>
          <Typography variant="body2">
            <strong>Categoría:</strong> {ageResult.ageCategory}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {ageResult.description}
          </Typography>
        </Paper>
      )}

      {!!errorMsg && (
        <Alert severity="error" sx={{ my: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Box sx={{ mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleCompleteRegistration}
        >
          Complete Registration
        </LoadingButton>
      </Box>
    </Box>
  );

  // Efecto para calcular edad cuando cambia la raza o fecha de nacimiento
  useEffect(() => {
    const currentBreed = watchPetForm('breed');
    const currentBirthDate = watchPetForm('birthDate');

    if (currentBirthDate && currentBreed) {
      calculatePetAge(currentBirthDate, currentBreed);
    }
  }, [calculatePetAge, watchPetForm]);

  // Si el código viene por props, pre-llenar el campo
  useEffect(() => {
    if (code) {
      codeMethods.setValue('code', code);
    }
  }, [code, codeMethods]);

  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {step.description}
              </Typography>

              {index === 0 && renderCodeStep()}
              {index === 1 && renderLoginStep()}
              {index === 2 && renderPetStep()}
              {index === 3 && renderPreviewStep()}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Typography sx={{ mb: 2 }}>
            Registration completed successfully!
          </Typography>
          <Button variant="contained" onClick={goToLogin}>
            Redirect to login
          </Button>
        </Paper>
      )}
    </>
  );
}
