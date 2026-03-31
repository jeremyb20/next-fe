/* eslint-disable no-nested-ternary */

'use client';

import * as Yup from 'yup';
import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import { countries } from '@/assets/data';
import { HOST_API } from '@/config-global';
import Iconify from '@/components/iconify';
import { useRouter } from '@/routes/hooks';
import { OptionType } from '@/types/global';
import { fData } from '@/utils/format-number';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useGetPetProfileById } from '@/hooks/use-fetch';
import { useTranslation } from '@/hooks/use-translation';
import RouterLink from '@/routes/components/router-link';
import { useManagerUser } from '@/hooks/use-manager-user';
import UploadAvatar from '@/components/upload/upload-avatar';
import CardComponent from '@/sections/_examples/card-component';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useMemo, useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/loading-screen/splash-screen';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';
import CostaRicaIDCard from '@/components/country-cards/Costa-Rica/costa-rica-card';
import PetLocationMap from '@/app/[lang]/pet/_components/locations/pet-location-map';
import MedicalControlView from '@/app/[lang]/pet/_components/view/medical-control-view';
import {
  parseWeight,
  BreedOptions,
  GENDER_OPTIONS,
  PET_STATUS_OPTIONS,
} from '@/utils/constants';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/utils/phone-validation';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from '@/components/hook-form';

import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Tab,
  Tabs,
  Stack,
  useTheme,
  Typography,
  IconButton,
  ButtonGroup,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

// ----------------------------------------------------------------------

type FormValues = {
  petName: string;
  petFirstSurname: string;
  petSecondSurname: string;
  genderSelected: string;
  breed: string;
  weight: string;
  address: string;
  phone: string;
  ownerPetName: string;
  petStatus: string;
  birthDate: string;
  favoriteActivities: string;
  healthAndRequirements: string;
  phoneVeterinarian: string;
  veterinarianContact: string;
  notes: string;
  // Permissions fields
  showPhoneInfo: boolean;
  showOwnerPetName: boolean;
  showEmailInfo: boolean;
  showBirthDate: boolean;
  showAddressInfo: boolean;
  showVeterinarianContact: boolean;
  showPhoneVeterinarian: boolean;
  showHealthAndRequirements: boolean;
  showFavoriteActivities: boolean;
  showLocationInfo: boolean;
  showLocationConsent: boolean;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pet-tabpanel-${index}`}
      aria-labelledby={`pet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mapeo de parámetros a IDs
const PARAM_TO_TAB_ID: Record<string, number> = {
  info: 0,
  permissions: 1,
  location: 2,
  medical: 3,
  card: 4,
};

type Props = {
  petId?: string;
};

export default function PetEditForm({ petId }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { user: currentUser } = useManagerUser();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const popover = usePopover();
  const [petLocation, setPetLocation] = useState({
    lat: '',
    lng: '',
    address: '',
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [photoIdToDelete, setPhotoIdToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Obtener el parámetro 'tab' de la URL
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const {
    data: currentPet,
    refetch,
    isFetching: isLoading,
    error,
    isError,
  } = useGetPetProfileById(petId);
  const TABS_CONFIG = useMemo(
    () => [
      {
        id: 0,
        value: 'information',
        label: 'Information',
        icon: 'solar:user-rounded-linear',
        param: 'info',
      },
      {
        id: 1,
        value: 'permissions',
        label: 'Permissions',
        icon: 'solar:shield-keyhole-linear',
        param: 'permissions',
      },
      {
        id: 2,
        value: 'location',
        label: 'Pet Location',
        icon: 'solar:point-on-map-outline',
        param: 'location',
      },
      {
        id: 3,
        value: 'medicalControl',
        label: 'Medical Control',
        icon: 'hugeicons:injection',
        param: 'medical',
      },
      ...(currentPet?.isDigitalIdentificationActive
        ? [
            {
              id: 4,
              value: 'digitalCard',
              label: 'Digital Card',
              icon: 'solar:card-outline',
              param: 'card',
            },
          ]
        : []),
    ],
    [currentPet?.isDigitalIdentificationActive]
  );

  const getInitialTab = useCallback(() => {
    if (tabParam && PARAM_TO_TAB_ID[tabParam] !== undefined) {
      return PARAM_TO_TAB_ID[tabParam];
    }
    return 0; // Default a información
  }, [tabParam]);

  const [tabValue, setTabValue] = useState(getInitialTab());

  const NewPetSchema = Yup.object().shape({
    petName: Yup.string().required('Pet name is required'),
    petFirstSurname: Yup.string().optional().default(''),
    petSecondSurname: Yup.string().optional().default(''),
    petStatus: Yup.string().required('Status is required'),
    genderSelected: Yup.string().optional().default(''),
    breed: Yup.string().optional().default(''),
    weight: Yup.string().optional().default(''),
    birthDate: Yup.string().optional().default(''),
    favoriteActivities: Yup.string().optional().default(''),
    healthAndRequirements: Yup.string().optional().default(''),
    phoneVeterinarian: Yup.string()
      .optional()
      .default('')
      .test(
        'valid-phone',
        'Please enter a valid phone number for the selected country',
        simplePhoneValidation
      ),
    veterinarianContact: Yup.string().optional().default(''),
    address: Yup.string().optional().default(''),
    phone: Yup.string()
      .optional()
      .default('')
      .test(
        'valid-phone',
        'Please enter a valid phone number for the selected country',
        simplePhoneValidation
      ),
    ownerPetName: Yup.string().optional().default(''),
    // Permissions fields - todos son booleanos opcionales
    showPhoneInfo: Yup.boolean().optional().default(true),
    showOwnerPetName: Yup.boolean().optional().default(true),
    showBirthDate: Yup.boolean().optional().default(true),
    showAddressInfo: Yup.boolean().optional().default(true),
    showEmailInfo: Yup.boolean().optional().default(true),
    showVeterinarianContact: Yup.boolean().optional().default(true),
    showPhoneVeterinarian: Yup.boolean().optional().default(true),
    showHealthAndRequirements: Yup.boolean().optional().default(true),
    showFavoriteActivities: Yup.boolean().optional().default(true),
    showLocationInfo: Yup.boolean().optional().default(true),
    showLocationConsent: Yup.boolean().optional().default(true),
    notes: Yup.string().optional().default(''),
  });

  const methods = useForm<FormValues>({
    resolver: yupResolver(NewPetSchema),
    defaultValues: {
      petName: '',
      petFirstSurname: '',
      petSecondSurname: '',
      genderSelected: '',
      breed: '',
      weight: '',
      birthDate: '',
      favoriteActivities: '',
      healthAndRequirements: '',
      phoneVeterinarian: '',
      veterinarianContact: '',
      address: '',
      phone: '',
      ownerPetName: '',
      petStatus: 'active',
      showPhoneInfo: true,
      showEmailInfo: true,
      showOwnerPetName: true,
      showBirthDate: true,
      showAddressInfo: true,
      showVeterinarianContact: true,
      showPhoneVeterinarian: true,
      showHealthAndRequirements: true,
      showFavoriteActivities: true,
      showLocationInfo: true,
      showLocationConsent: true,
      notes: '',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const watchPhone = watch('phone');
  const watchPhoneVeterinarian = watch('phoneVeterinarian');

  // Manejar errores de permisos
  useEffect(() => {
    if (isError && error) {
      const status = (error as any)?.response?.status;
      if (status === 403 || status === 404) {
        enqueueSnackbar(
          t('You do not have permission to view this pet profile'),
          { variant: 'error' }
        );

        // Redirigir después de 2 segundos
        const timeout = setTimeout(() => {
          router.push(paths.dashboard.user.pets);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }
    return undefined;
  }, [isError, error, router, enqueueSnackbar, t]);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);

      // Obtener el parámetro correspondiente al nuevo tab
      const selectedTab = TABS_CONFIG.find((tab) => tab.id === newValue);
      if (selectedTab) {
        // Crear nuevos parámetros de URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', selectedTab.param);

        // Actualizar la URL sin recargar la página
        router.replace(`${window.location.pathname}?${params.toString()}`, {
          scroll: false,
        });
      }
    },
    [TABS_CONFIG, router, searchParams]
  );

  // Función para manejar la subida de foto
  const handleDropPetPhoto = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setPetPhoto(newFile);

        // Si hay una foto existente, guardar su photo_id para eliminarla después
        if (currentPet?.photo_id) {
          setPhotoIdToDelete(currentPet.photo_id);
        }

        // Crear preview para mostrar
        const previewUrl = URL.createObjectURL(newFile);
        setPetPhotoPreview(previewUrl);
      }
    },
    [currentPet?.photo_id]
  );

  // Función para eliminar la foto
  const handleRemovePetPhoto = useCallback(() => {
    setPetPhoto(null);

    // Si hay una foto existente, guardar su photo_id para eliminarla
    if (currentPet?.photo_id) {
      setPhotoIdToDelete(currentPet.photo_id);
    }

    if (petPhotoPreview && petPhotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(petPhotoPreview);
    }

    setPetPhotoPreview(null);
  }, [currentPet?.photo_id, petPhotoPreview]);

  const handleWeightUnitChange = (unit: 'kg' | 'lb') => {
    setWeightUnit(unit);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const weightWithUnit = data.weight ? `${data.weight} ${weightUnit}` : '';
      const userPetId = currentUser?._id || '';
      const petData = {
        ...data,
        id: currentPet?._id,
        weight: weightWithUnit,
        lat: petLocation.lat,
        lng: petLocation.lng,
        address: data.address,
        genderSelected: data.genderSelected,
        // Si el usuario eliminó la foto, agregar flag para eliminar
        ...(photoIdToDelete &&
          !petPhoto &&
          !petPhotoPreview && { removePhoto: true }),
        // Agregar photo_id de la imagen anterior si existe
        ...(photoIdToDelete && { photo_id: photoIdToDelete }),
        // Estructura para las permissions
        permissions: {
          showPhoneInfo: data.showPhoneInfo,
          showOwnerPetName: data.showOwnerPetName,
          showEmailInfo: data.showEmailInfo,
          showBirthDate: data.showBirthDate,
          showAddressInfo: data.showAddressInfo,
          showVeterinarianContact: data.showVeterinarianContact,
          showPhoneVeterinarian: data.showPhoneVeterinarian,
          showHealthAndRequirements: data.showHealthAndRequirements,
          showFavoriteActivities: data.showFavoriteActivities,
          showLocationInfo: data.showLocationInfo,
          showLocationConsent: data.showLocationConsent,
        },
      };

      // Crear el payload según el formato que espera tu API
      const payload = {
        petData,
        userId: userPetId,
        // Solo agregar la imagen si existe
        ...(petPhoto && { image: petPhoto }),
      };

      const endpoint = currentPet?._id
        ? `${HOST_API}${endpoints.pet.updatePetById}`
        : `${HOST_API}${endpoints.pet.createPet}`;

      const method = currentPet?._id ? 'PUT' : 'POST';

      await mutateAsync<typeof payload>({
        payload: payload as any,
        pEndpoint: endpoint,
        method,
        isFormData: Boolean(petPhoto),
      });

      refetch();
      enqueueSnackbar(
        currentPet?._id
          ? 'Pet updated successfully!'
          : 'Pet created successfully!',
        {
          variant: 'success',
        }
      );
    } catch (errors) {
      console.error(errors);
      enqueueSnackbar('Error updating pet', { variant: 'error' });
    }
  };

  // Resetear el formulario cuando currentPet cambia
  useEffect(() => {
    if (currentPet) {
      const parsedWeight = parseWeight(currentPet?.weight);
      methods.reset({
        petName: currentPet?.petName || '',
        petFirstSurname: currentPet?.petFirstSurname || '',
        petSecondSurname: currentPet?.petSecondSurname || '',
        genderSelected: currentPet?.genderSelected || '',
        breed: currentPet?.breed || '',
        weight: parsedWeight.value,
        birthDate: currentPet?.birthDate
          ? new Date(currentPet.birthDate).toISOString()
          : '',
        favoriteActivities: currentPet?.favoriteActivities || '',
        healthAndRequirements: currentPet?.healthAndRequirements || '',
        phoneVeterinarian: currentPet?.phoneVeterinarian || '',
        veterinarianContact: currentPet?.veterinarianContact || '',
        address: currentPet?.address || '',
        phone: currentPet?.phone || '',
        ownerPetName: currentPet?.ownerPetName || '',
        petStatus: currentPet?.petStatus || 'active',
        showPhoneInfo: currentPet?.permissions?.showPhoneInfo ?? true,
        showEmailInfo: currentPet?.permissions?.showEmailInfo ?? true,
        showOwnerPetName: currentPet?.permissions?.showOwnerPetName ?? true,
        showBirthDate: currentPet?.permissions?.showBirthDate ?? true,
        showAddressInfo: currentPet?.permissions?.showAddressInfo ?? true,
        showVeterinarianContact:
          currentPet?.permissions?.showVeterinarianContact ?? true,
        showPhoneVeterinarian:
          currentPet?.permissions?.showPhoneVeterinarian ?? true,
        showHealthAndRequirements:
          currentPet?.permissions?.showHealthAndRequirements ?? true,
        showFavoriteActivities:
          currentPet?.permissions?.showFavoriteActivities ?? true,
        showLocationInfo: currentPet?.permissions?.showLocationInfo ?? true,
        showLocationConsent:
          currentPet?.permissions?.showLocationConsent ?? true,
        notes: currentPet?.notes || '',
      });

      setPetLocation({
        lat: currentPet.lat || '',
        lng: currentPet.lng || '',
        address: currentPet.address || '',
      });

      setPetPhotoPreview(currentPet.photo || null);
    } else if (!isLoading && petId) {
      // Resetear a valores por defecto cuando no hay datos
      methods.reset({
        petName: '',
        petFirstSurname: '',
        petSecondSurname: '',
        genderSelected: '',
        breed: '',
        weight: '',
        birthDate: '',
        favoriteActivities: '',
        healthAndRequirements: '',
        phoneVeterinarian: '',
        veterinarianContact: '',
        address: '',
        phone: '',
        ownerPetName: '',
        petStatus: 'active',
        showPhoneInfo: true,
        showEmailInfo: true,
        showOwnerPetName: true,
        showBirthDate: true,
        showAddressInfo: true,
        showVeterinarianContact: true,
        showPhoneVeterinarian: true,
        showHealthAndRequirements: true,
        showFavoriteActivities: true,
        showLocationInfo: true,
        showLocationConsent: true,
        notes: '',
      });

      setPetLocation({ lat: '', lng: '', address: '' });
      setPetPhotoPreview(null);
    }
  }, [currentPet, isLoading, petId, methods]);

  // Reemplaza useMemo por useEffect para weightUnit
  useEffect(() => {
    if (currentPet?.weight) {
      const parsedWeight = parseWeight(currentPet.weight);
      setWeightUnit(parsedWeight.unit as 'kg' | 'lb');
    } else {
      setWeightUnit('kg');
    }
  }, [currentPet]);

  // Limpiar URLs de fotos
  useEffect(
    () => () => {
      if (petPhotoPreview && petPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(petPhotoPreview);
      }
    },
    [petPhotoPreview]
  );

  // Detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sincronizar tabValue con URL
  useEffect(() => {
    const newTabValue = getInitialTab();
    if (newTabValue !== tabValue) {
      setTabValue(newTabValue);
    }
  }, [tabParam, getInitialTab, tabValue]);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Si no hay datos de mascota
  if (!currentPet) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          padding: 3,
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('No information was found about the pet.')}
        </Typography>
        {currentUser?.email && (
          <Button
            component={RouterLink}
            href={paths.dashboard.user.pets}
            onClick={() =>
              queryClient.removeQueries({ queryKey: ['useGetPetProfileById'] })
            }
            variant="contained"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="h4" fontWeight={700}>
              {t('Back')}
            </Typography>
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'background.default',
          transition: 'padding 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          pt: isScrolled ? 8 : 2,
          ...(isScrolled && {
            boxShadow: theme.shadows[2],
            borderBottom: '1px solid',
            borderColor: 'divider',
          }),
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: t('Home'), href: paths.dashboard.root },
            {
              name: t('My Pets'),
              href: paths.dashboard.user.pets,
            },
            { name: `${t('Edit')} ${currentPet?.petName || 'Pet'}` },
          ]}
          action={
            <LoadingButton
              type="submit"
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={isSubmitting}
            >
              {t('Update Pet')}
            </LoadingButton>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />
      </Box>

      <FormProvider methods={methods}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          scrollButtons="auto"
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600,
              minHeight: 60,
            },
          }}
        >
          {TABS_CONFIG.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.id}
              label={t(tab.label)}
              icon={<Iconify icon={tab.icon} />}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CardComponent sx={{ p: 2 }}>
            <Stack
              my={1}
              spacing={1}
              direction="row"
              justifyContent="space-around"
            >
              <Stack>
                <UploadAvatar
                  file={currentPet?.photo}
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
                        message: t(
                          'Only JPEG, JPG, PNG or GIF images are allowed'
                        ),
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
              </Stack>
            </Stack>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect name="petStatus" label={t('Current Status')}>
                {PET_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {t(status.label)}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="genderSelected" label={t('Gender')}>
                {GENDER_OPTIONS.map((gender) => (
                  <MenuItem key={gender.value} value={gender.value}>
                    {t(gender.label)}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="petName" label={t('Pet Name')} />
              <RHFTextField name="petFirstSurname" label={t('First Surname')} />
              <RHFTextField
                name="petSecondSurname"
                label={t('Second Surname')}
              />
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
                  setValue('breed', stringValue, { shouldValidate: true });
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
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
                render={({ field }) => (
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label={t('Birth Date')}
                    minDate={new Date('2000-03-01')}
                    maxDate={new Date()}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.toISOString() : '');
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField name="ownerPetName" label={t('Owner Name')} />
              <RHFTextField
                name="phone"
                label={t('Phone Number')}
                placeholder={getPhonePlaceholder(
                  currentUser?.profile?.country || '',
                  'Phone number'
                )}
                helperText={getPhoneHelperText(
                  currentUser?.profile?.country || '',
                  watchPhone,
                  t
                )}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify
                          icon={`flag:${countries
                            .find(
                              (c) =>
                                c.label.toLowerCase() ===
                                currentUser?.profile?.country?.toLowerCase()
                            )
                            ?.code.toLowerCase()}-4x3`}
                        />
                        <Box>
                          (+
                          {`${countries
                            .find(
                              (c) =>
                                c.label.toLowerCase() ===
                                currentUser?.profile?.country?.toLowerCase()
                            )
                            ?.phone.toLowerCase()}`}{' '}
                          )
                        </Box>
                      </Stack>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={popover.onOpen}>
                      <Iconify icon="line-md:cog-filled" />
                    </IconButton>
                  ),
                }}
              />
              <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
              >
                <MenuItem
                  onClick={() => {
                    setValue('phone', currentUser?.profile?.phone || '');
                    popover.onClose();
                  }}
                >
                  Set to {currentUser?.profile?.phone} {' * '}
                  <Iconify icon="line-md:phone" />
                </MenuItem>
              </CustomPopover>
              <RHFTextField
                name="favoriteActivities"
                label={t('Favorite Activities')}
                multiline
                rows={2}
              />
              <RHFTextField
                name="healthAndRequirements"
                label={t('Health & Requirements')}
                multiline
                rows={2}
              />
              <RHFTextField
                name="veterinarianContact"
                label={t('Veterinarian Name')}
              />
              <RHFTextField
                name="phoneVeterinarian"
                label={t('Veterinarian Phone')}
                placeholder={getPhonePlaceholder(
                  currentUser?.profile?.country || '',
                  'Veterinanrian Phone'
                )}
                helperText={getPhoneHelperText(
                  currentUser?.profile?.country || '',
                  watchPhoneVeterinarian,
                  t
                )}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify
                          icon={`flag:${countries
                            .find(
                              (c) =>
                                c.label.toLowerCase() ===
                                currentUser?.profile?.country?.toLowerCase()
                            )
                            ?.code.toLowerCase()}-4x3`}
                        />
                        <Box>
                          (+
                          {`${countries
                            .find(
                              (c) =>
                                c.label.toLowerCase() ===
                                currentUser?.profile?.country?.toLowerCase()
                            )
                            ?.phone.toLowerCase()}`}{' '}
                          )
                        </Box>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="address"
                label={t('Address')}
                multiline
                rows={2}
                sx={{ gridColumn: '1 / -1' }}
              />
              <RHFTextField
                name="notes"
                label={t('Notes')}
                multiline
                rows={2}
                sx={{ gridColumn: '1 / -1' }}
              />
            </Box>
          </CardComponent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack
              spacing={1.5}
              sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('Owner Information')}
              </Typography>
              <RHFSwitch
                name="showPhoneInfo"
                labelPlacement="start"
                label={t('Show Phone Number')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
              <RHFSwitch
                name="showEmailInfo"
                labelPlacement="start"
                label={t('Show Email Info')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />

              <RHFSwitch
                name="showOwnerPetName"
                labelPlacement="start"
                label={t('Show Owner Name')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
            </Stack>

            <Stack
              spacing={1.5}
              sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('Pet Information')}
              </Typography>

              <RHFSwitch
                name="showBirthDate"
                labelPlacement="start"
                label={t('Show Birth Date')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />

              <RHFSwitch
                name="showFavoriteActivities"
                labelPlacement="start"
                label={t('Show Favorite Activities')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />

              <RHFSwitch
                name="showHealthAndRequirements"
                labelPlacement="start"
                label={t('Show Health & Requirements')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
              <RHFSwitch
                name="showAddressInfo"
                labelPlacement="start"
                label={t('Show Address Information')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
              <RHFSwitch
                name="showLocationInfo"
                labelPlacement="start"
                label={t('Show Location Information')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
              <RHFSwitch
                name="showLocationConsent"
                labelPlacement="start"
                label={t('Show Consent Location Information')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
            </Stack>

            <Stack
              spacing={1.5}
              sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('Veterinarian Information')}
              </Typography>

              <RHFSwitch
                name="showVeterinarianContact"
                labelPlacement="start"
                label={t('Show Veterinarian Name')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />

              <RHFSwitch
                name="showPhoneVeterinarian"
                labelPlacement="start"
                label={t('Show Veterinarian Phone')}
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                }}
              />
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxHeight: isMobile ? '85vh' : '55vh', overflow: 'auto' }}>
            <Stack spacing={3}>
              <Typography variant="h6">📍 {t('Pet Location')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  'Click on the map to set your pet location or search for an address'
                )}
              </Typography>

              <PetLocationMap
                initialLocation={petLocation}
                onLocationChange={(loc) =>
                  setPetLocation({
                    lat: loc.lat,
                    lng: loc.lng,
                    address: loc.address ?? '',
                  })
                }
                readOnly={false}
              />
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <MedicalControlView
            currentPet={currentPet}
            memberPetId={petId || ''}
          />
        </TabPanel>

        {currentPet?.isDigitalIdentificationActive && (
          <TabPanel value={tabValue} index={4}>
            <CostaRicaIDCard data={currentPet} />
          </TabPanel>
        )}

        <Stack
          pb={5}
          sx={{
            display: {
              xs: tabValue === 4 ? 'none' : 'flex',
              md: 'none',
            },
          }}
        >
          <LoadingButton
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            size="large"
            loading={isSubmitting}
          >
            {t('Update Pet')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
