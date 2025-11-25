'use client';

import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

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

import { useRouter } from 'src/routes/hooks';

import { countries } from 'src/assets/data';

// import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

import { useSnackbar } from 'notistack';
import { endpoints } from '@/src/utils/axios';
import Iconify from '@/src/components/iconify';
import { HOST_API } from '@/src/config-global';
import { OptionType } from '@/src/types/global';
import useIPInfo from '@/src/hooks/use-ip-info';
import { useBoolean } from '@/src/hooks/use-boolean';
import { getValidationCode } from '@/src/hooks/use-fetch';
import { PetAgeCalculator } from '@/src/utils/pet-age-calculator';
import { BreedOptions, GENDER_OPTIONS } from '@/src/utils/constants';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import {
  getDogSizeFromBreed,
  getSpeciesFromBreed,
} from '@/src/utils/pet-utils';
import ValuesPreview from '@/src/sections/_examples/extra/form-validation-view/values-preview';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/src/utils/phone-validation';

import {
  Stack,
  MenuItem,
  IconButton,
  ButtonGroup,
  InputAdornment,
} from '@mui/material';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// Esquema de validación para el código
const CodeSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .min(4, 'Code must be at least 4 characters'),
});

// Esquema de validación para el usuario
const UserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  phone: Yup.string()
    .required('Phone number is required')
    .test(
      'valid-phone',
      'Please enter a valid phone number for the selected country',
      simplePhoneValidation
    ),
  country: Yup.string().required('Country is required'),
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
    description: 'Enter your invitation code to start the registration',
  },
  {
    label: 'User Registration',
    description: 'Create your user account to start managing your pets',
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

export default function PetRegistrationCodeStepper({
  code,
}: {
  code?: string;
}) {
  const router = useRouter();
  const password = useBoolean();
  const { ipData } = useIPInfo();

  const { mutateAsync } = useCreateGenericMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Estado local para la edad de la mascota
  const [ageResult, setAgeResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [petData, setPetData] = useState<any>(null);

  // Formulario para código
  const codeMethods = useForm({
    resolver: yupResolver(CodeSchema),
    defaultValues: {
      code: code || '',
    },
  });

  // Formulario para usuario
  const userMethods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      country: '',
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
    handleSubmit: handleUserSubmit,
    watch,
    setValue: setUserValue,
    formState: { isSubmitting: isUserSubmitting },
  } = userMethods;

  const {
    handleSubmit: handlePetSubmit,
    setValue: setPetValue,
    control,
    watch: watchPetForm,
    formState: { isSubmitting: isPetSubmitting },
  } = petMethods;

  const watchCountry = watch('country');
  const watchPhone = watch('phone');
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

  // Paso 1: Validación del código

  const onCodeSubmit = handleCodeSubmit(async (data) => {
    try {
      setErrorMsg(''); // Limpiar errores previos

      const { data: res, error, isError } = await getValidationCode(data.code);

      console.log('Full validation response:', { res, error, isError });

      // Si hay error en la petición (network, etc.)
      if (isError) {
        setErrorMsg(error?.message || 'Network error. Please try again.');
        return;
      }

      // Si no hay respuesta
      if (!res) {
        setErrorMsg('No response from server. Please try again.');
        return;
      }

      // Si todo está bien - usar callback para asegurar el estado
      setIsCodeValid(true);
      setErrorMsg('');

      // Avanzar inmediatamente
      setActiveStep(1);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setErrorMsg(
        error.message || 'An unexpected error occurred. Please try again.'
      );
    }
  });

  // Función para calcular la edad usando useCallback para evitar recreaciones innecesarias
  const calculatePetAge = useCallback(
    (birthDate: string, breedValue?: string) => {
      if (!birthDate) {
        setAgeResult(null);
        setRecommendations([]);
        return;
      }

      try {
        // Determinar especie basado en la raza
        let species: 'dog' | 'cat' = 'dog'; // valor por defecto
        let size: 'small' | 'medium' | 'large' | undefined;

        if (breedValue) {
          const detectedSpecies = getSpeciesFromBreed(breedValue);
          if (detectedSpecies) {
            species = detectedSpecies;

            // Solo determinar tamaño para perros
            if (detectedSpecies === 'dog') {
              size = getDogSizeFromBreed(breedValue) || undefined;
            }
          }
        }

        const result = PetAgeCalculator.calculateAge(birthDate, {
          species,
          size, // será undefined para gatos, lo cual está bien
        });

        setAgeResult({
          ...result,
          species, // agregar la especie al resultado para mostrarla
          size, // agregar el tamaño al resultado
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

  // Paso 2: Registro de usuario
  const onUserSubmit = handleUserSubmit(async (data) => {
    try {
      // Aquí iría tu lógica de registro
      //   await register?.(
      //     data.email,
      //     data.password,
      //     data.firstName,
      //     data.lastName
      //   );
      setUserData(data);
      handleNext();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  // Paso 3: Información de la mascota
  const onPetSubmit = handlePetSubmit(async (data) => {
    try {
      setPetData(data);
      handleNext();
    } catch (error) {
      console.error(error);
      setErrorMsg('Error saving pet information');
    }
  });

  // Paso 4: Confirmación y registro completo
  const handleCompleteRegistration = async () => {
    try {
      // Aquí iría la lógica para guardar la mascota en la base de datos
      // usando userData y petData

      const weightWithUnit = petData.weight
        ? `${petData.weight} ${weightUnit}`
        : '';
      const completeData = {
        code: watchCodeValue, // El código validado
        userData: {
          ...userData,
        },
        petData: {
          ...petData,
          weight: weightWithUnit,
        },
      };

      const test = await mutateAsync<any>({
        payload: completeData as any,
        pEndpoint: `${HOST_API}${endpoints.user.registerNewPetByQRcode}`,
        method: 'POST',
      });
      console.log('Test:', test);
      setErrorMsg('');
      enqueueSnackbar('Registration completed successfully', {
        variant: 'success',
      });
      // Redirigir al dashboard o página de éxito
      //   router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Error completing registration');
      enqueueSnackbar(error.message || 'Error completing registration', {
        variant: 'error',
      });
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsCodeValid(false);
    setUserData(null);
    setPetData(null);
    setErrorMsg('');
    setAgeResult(null);
    setRecommendations([]);
    codeMethods.reset();
    userMethods.reset();
    petMethods.reset();
  };

  // Renderizar Edad de la mascota cuando se calcule
  const renderAgeResult = (
    <>
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
        </Paper>
      )}
    </>
  );

  // Renderizar el paso 1 - Validación del código
  const renderCodeStep = () => (
    <FormProvider methods={codeMethods} onSubmit={onCodeSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3 }}>
          Please enter your invitation code to start the registration process.
        </Typography>

        <RHFTextField
          name="code"
          label="Invitation Code"
          placeholder="Enter your code"
          autoComplete="off"
          autoFocus
        />

        <Box sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isCodeSubmitting}
            disabled={!watchCodeValue}
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

  // Renderizar el paso 2 - Registro de usuario
  const renderUserStep = () => (
    <FormProvider methods={userMethods} onSubmit={onUserSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3, color: 'success.main' }}>
          ✓ Code validated successfully
        </Typography>

        <ValuesPreview />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: '1fr',
            mt: 3,
          }}
        >
          <RHFAutocomplete
            name="country"
            type="country"
            label="Country"
            placeholder="Choose a country"
            fullWidth
            options={countries.map((option) => option.label)}
            getOptionLabel={(option) => option}
          />
          <RHFTextField
            name="phone"
            label="Phone Number"
            placeholder={getPhonePlaceholder(watchCountry, 'Phone number')}
            helperText={getPhoneHelperText(watchCountry, watchPhone)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify
                      icon={`flag:${countries
                        .find(
                          (c) =>
                            c.label.toLowerCase() ===
                            watchCountry?.toLowerCase()
                        )
                        ?.code.toLowerCase()}-4x3`}
                    />
                    <Box>
                      (+
                      {`${countries
                        .find(
                          (c) =>
                            c.label.toLowerCase() ===
                            watchCountry?.toLowerCase()
                        )
                        ?.phone.toLowerCase()}`}{' '}
                      )
                    </Box>
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <RHFTextField name="email" label="Email address" sx={{ mt: 2 }} />

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
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 3 }}>
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isUserSubmitting}
          >
            Continue
          </LoadingButton>
        </Box>
      </Box>
    </FormProvider>
  );

  // Renderizar el paso 3 - Información de la mascota
  const renderPetStep = () => (
    <FormProvider methods={petMethods} onSubmit={onPetSubmit}>
      <Box sx={{ mt: 2 }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <ValuesPreview />

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
                      margin: 'normal',
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              );
            }}
          />
        </Box>

        {renderAgeResult}

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

  // Renderizar el paso 4 - Preview
  const renderPreviewStep = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          Code Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Invitation Code:</strong> {watchCodeValue}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Name:</strong> {userData?.firstName} {userData?.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {userData?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Phone:</strong> {userData?.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Country:</strong> {userData?.country}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Typography variant="h6" gutterBottom>
          Pet Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Name:</strong> {petData?.petName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Breed: </strong>
          {BreedOptions.todos.find((breed) => breed.value === petData?.breed)
            ?.label || 'Unknown breed'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Gender:</strong> {petData?.genderSelected}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Weight:</strong> {petData?.weight} {weightUnit}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Birth Date:</strong>{' '}
          {petData?.birthDate
            ? new Date(petData.birthDate).toLocaleDateString()
            : 'Not specified'}
        </Typography>
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
      {!!errorMsg && (
        <Alert severity="error" sx={{ my: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Box sx={{ mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleCompleteRegistration}>
          Complete Registration
        </Button>
      </Box>
    </Box>
  );

  // Revalidar el teléfono cuando cambia el país
  useEffect(() => {
    if (watchPhone && watchCountry) {
      userMethods.trigger('phone');
    }
  }, [watchCountry, watchPhone, userMethods]);

  useEffect(() => {
    if (ipData?.country) {
      setUserValue('country', ipData.country, { shouldValidate: true });
    }
  }, [ipData, setUserValue]);

  useEffect(() => {
    const currentBreed = watchPetForm('breed');
    const currentBirthDate = watchPetForm('birthDate');

    if (currentBirthDate && currentBreed) {
      calculatePetAge(currentBirthDate, currentBreed);
    }
  }, [calculatePetAge, watchPetForm]);

  // Si el código viene por props, pre-llenar el campo y avanzar automáticamente si es válido
  useEffect(() => {
    if (code) {
      codeMethods.setValue('code', code);
      // Opcional: validar automáticamente si el código viene por props
      // validateCode(code).then(isValid => {
      //   if (isValid) {
      //     setIsCodeValid(true);
      //     setActiveStep(1);
      //   }
      // });
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
              {index === 1 && renderUserStep()}
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
          <Button onClick={handleReset}>Register Another Pet</Button>
        </Paper>
      )}
    </>
  );
}
