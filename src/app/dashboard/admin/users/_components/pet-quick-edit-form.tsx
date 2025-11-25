/* eslint-disable no-nested-ternary */
import * as Yup from 'yup';
import { endpoints } from '@/src/utils/axios';
import { countries } from '@/src/assets/data';
import { HOST_API } from '@/src/config-global';
import Iconify from '@/src/components/iconify';
import { OptionType } from '@/src/types/global';
import { IUser, IPetProfile } from '@/src/types/api';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CardComponent from '@/src/sections/_examples/card-component';
import CustomPopover, { usePopover } from '@/src/components/custom-popover';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import MedicalControlView from '@/src/app/pet/_components/view/medical-control-view';
import {
  parseWeight,
  BreedOptions,
  GENDER_OPTIONS,
} from '@/src/utils/constants';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/src/utils/phone-validation';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValues = {
  petName: string;
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
  // Permissions fields
  showPhoneInfo: boolean;
  showLinkTwitter: boolean;
  showLinkFacebook: boolean;
  showLinkInstagram: boolean;
  showOwnerPetName: boolean;
  showBirthDate: boolean;
  showAddressInfo: boolean;
  showVeterinarianContact: boolean;
  showPhoneVeterinarian: boolean;
  showHealthAndRequirements: boolean;
  showFavoriteActivities: boolean;
  showLocationInfo: boolean;
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

// Opciones para los selects
const PET_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lost', label: 'Lost' },
  { value: 'deceased', label: 'Deceased' },
];

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentPet?: IPetProfile;
  currentUser?: IUser;
  refetch: () => void;
};

export default function PetQuickEditForm({
  currentPet,
  currentUser,
  open,
  onClose,
  refetch,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();
  const [tabValue, setTabValue] = useState(0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const popover = usePopover();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const petStatus = PET_STATUS_OPTIONS.find(
    (option) => option.value === currentPet?.petStatus
  );

  const NewPetSchema = Yup.object().shape({
    petName: Yup.string().required('Pet name is required'),
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
    showLinkTwitter: Yup.boolean().optional().default(true),
    showLinkFacebook: Yup.boolean().optional().default(true),
    showLinkInstagram: Yup.boolean().optional().default(true),
    showOwnerPetName: Yup.boolean().optional().default(true),
    showBirthDate: Yup.boolean().optional().default(true),
    showAddressInfo: Yup.boolean().optional().default(true),
    showVeterinarianContact: Yup.boolean().optional().default(true),
    showPhoneVeterinarian: Yup.boolean().optional().default(true),
    showHealthAndRequirements: Yup.boolean().optional().default(true),
    showFavoriteActivities: Yup.boolean().optional().default(true),
    showLocationInfo: Yup.boolean().optional().default(true),
  });

  const defaultValues: FormValues = useMemo(() => {
    const parsedWeight = parseWeight(currentPet?.weight);
    return {
      petName: currentPet?.petName || '',
      genderSelected: currentPet?.genderSelected || '',
      breed: currentPet?.breed || '',
      weight: parsedWeight.value,
      birthDate: currentPet?.birthDate
        ? new Date(currentPet.birthDate).toISOString() // Convertir a ISO
        : '',
      // birthDate: currentPet?.birthDate || '',
      favoriteActivities: currentPet?.favoriteActivities || '',
      healthAndRequirements: currentPet?.healthAndRequirements || '',
      phoneVeterinarian: currentPet?.phoneVeterinarian || '',
      veterinarianContact: currentPet?.veterinarianContact || '',
      address: currentPet?.address || '',
      phone: currentPet?.phone || '',
      ownerPetName: currentPet?.ownerPetName || '',
      petStatus: currentPet?.petStatus || 'active',
      // Permissions defaults
      showPhoneInfo: currentPet?.permissions?.showPhoneInfo ?? true,
      showLinkTwitter: currentPet?.permissions?.showLinkTwitter ?? true,
      showLinkFacebook: currentPet?.permissions?.showLinkFacebook ?? true,
      showLinkInstagram: currentPet?.permissions?.showLinkInstagram ?? true,
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
    };
  }, [currentPet]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(NewPetSchema),
    defaultValues,
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

  const handleWeightUnitChange = (unit: 'kg' | 'lb') => {
    setWeightUnit(unit);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const weightWithUnit = data.weight ? `${data.weight} ${weightUnit}` : '';
      const updateData = {
        ...data,
        id: currentPet?._id,
        weight: weightWithUnit,
        genderSelected: data.genderSelected,
        // Estructura para las permissions
        permissions: {
          showPhoneInfo: data.showPhoneInfo,
          showLinkTwitter: data.showLinkTwitter,
          showLinkFacebook: data.showLinkFacebook,
          showLinkInstagram: data.showLinkInstagram,
          showOwnerPetName: data.showOwnerPetName,
          showBirthDate: data.showBirthDate,
          showAddressInfo: data.showAddressInfo,
          showVeterinarianContact: data.showVeterinarianContact,
          showPhoneVeterinarian: data.showPhoneVeterinarian,
          showHealthAndRequirements: data.showHealthAndRequirements,
          showFavoriteActivities: data.showFavoriteActivities,
          showLocationInfo: data.showLocationInfo,
        },
      };
      const endpoint = currentPet?._id
        ? `${HOST_API}${endpoints.pet.updatePetById}`
        : `${HOST_API}${endpoints.pet.createPet}`;

      const method = currentPet?._id ? 'PUT' : 'POST';

      await mutateAsync<IPetProfile>({
        payload: updateData as unknown as IPetProfile,
        pEndpoint: endpoint,
        method,
      });

      refetch();
      onClose();
      // enqueueSnackbar('Pet updated successfully!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating pet', { variant: 'error' });
    }
  });

  // Reemplaza useMemo por useEffect para weightUnit
  useEffect(() => {
    if (currentPet?.weight) {
      const parsedWeight = parseWeight(currentPet.weight);
      setWeightUnit(parsedWeight.unit as 'kg' | 'lb');
    } else {
      setWeightUnit('kg');
    }
  }, [currentPet]);

  // Agrega este useEffect para resetear el formulario
  useEffect(() => {
    if (open && currentPet) {
      methods.reset(defaultValues);
    }
  }, [open, currentPet, methods, defaultValues]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
      scroll="paper"
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit {currentPet?.petName}</DialogTitle>

        <DialogContent dividers>
          {petStatus && (
            <Alert
              variant="outlined"
              severity={
                petStatus.value === 'active'
                  ? 'success'
                  : petStatus.value === 'lost'
                    ? 'warning'
                    : 'info'
              }
              sx={{ mb: 3 }}
            >
              Pet is currently {petStatus.label}
            </Alert>
          )}

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
            {[
              {
                id: 0,
                value: 'information',
                label: 'Information',
                icon: 'solar:user-rounded-linear',
              },
              {
                id: 1,
                value: 'permissions',
                label: 'Permissions',
                icon: 'solar:shield-keyhole-linear',
              },
              {
                id: 2,
                value: 'location',
                label: 'Location',
                icon: 'solar:point-on-map-outline',
              },
              {
                id: 3,
                value: 'medicalControl',
                label: 'Medical Control',
                icon: 'hugeicons:injection',
              },
            ].map((tab) => (
              <Tab
                key={tab.value}
                value={tab.id}
                label={tab.label}
                icon={<Iconify icon={tab.icon} />}
                iconPosition="start"
              />
            ))}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <CardComponent sx={{ p: 2 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFSelect name="petStatus" label="Status">
                  {PET_STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect name="genderSelected" label="Gender">
                  {GENDER_OPTIONS.map((gender) => (
                    <MenuItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFTextField name="petName" label="Pet Name" />
                {/* <RHFTextField name="breed" label="Breed" /> */}

                <RHFAutocomplete
                  name="breed"
                  label="Raza de la mascota"
                  options={BreedOptions.todos}
                  getOptionLabel={(option: OptionType | string) => {
                    if (typeof option === 'string') {
                      // Buscar la opción por el value string
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
                    // Asegurar que solo se guarde el value como string
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
                    // Actualizar el valor del formulario
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
                  label="Weight"
                  type="number"
                  inputProps={{ step: '0.1' }} // Para permitir decimales
                  InputProps={{
                    endAdornment: (
                      <ButtonGroup
                        variant="outlined"
                        aria-label="Weight unit selector"
                        size="small"
                      >
                        <Button
                          onClick={() => handleWeightUnitChange('kg')}
                          variant={
                            weightUnit === 'kg' ? 'contained' : 'outlined'
                          }
                        >
                          kg
                        </Button>
                        <Button
                          onClick={() => handleWeightUnitChange('lb')}
                          variant={
                            weightUnit === 'lb' ? 'contained' : 'outlined'
                          }
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
                  defaultValue={defaultValues.birthDate}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      views={['year', 'month', 'day']}
                      label="Year and Month"
                      minDate={new Date('2000-03-01')}
                      maxDate={new Date()}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.toISOString() : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                        },
                      }}
                    />
                  )}
                />
                <RHFTextField name="ownerPetName" label="Owner Name" />
                <RHFTextField
                  name="phone"
                  label="Phone"
                  placeholder={getPhonePlaceholder(
                    currentUser?.profile?.country || '',
                    'Phone number'
                  )}
                  helperText={getPhoneHelperText(
                    currentUser?.profile?.country || '',
                    watchPhone
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
                  label="Favorite Activities"
                  multiline
                  rows={2}
                />
                <RHFTextField
                  name="healthAndRequirements"
                  label="Health & Requirements"
                  multiline
                  rows={2}
                />

                <RHFTextField
                  name="veterinarianContact"
                  label="Veterinarian Name"
                />
                <RHFTextField
                  name="phoneVeterinarian"
                  label="Veterinarian Phone"
                  placeholder={getPhonePlaceholder(
                    currentUser?.profile.country || '',
                    'Veterinanrian Phone'
                  )}
                  helperText={getPhoneHelperText(
                    currentUser?.profile.country || '',
                    watchPhoneVeterinarian
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
                                  currentUser?.profile.country?.toLowerCase()
                              )
                              ?.code.toLowerCase()}-4x3`}
                          />
                          <Box>
                            (+
                            {`${countries
                              .find(
                                (c) =>
                                  c.label.toLowerCase() ===
                                  currentUser?.profile.country?.toLowerCase()
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
                  label="Address"
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
                  Contact Information
                </Typography>

                <RHFSwitch
                  name="showPhoneInfo"
                  labelPlacement="start"
                  label="Show Phone Number"
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
                  label="Show Owner Name"
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
                  label="Show Address Information"
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
                  label="Show Location Information"
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
                  Pet Information
                </Typography>

                <RHFSwitch
                  name="showBirthDate"
                  labelPlacement="start"
                  label="Show Birth Date"
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
                  label="Show Favorite Activities"
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
                  label="Show Health & Requirements"
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
                  Veterinarian Information
                </Typography>

                <RHFSwitch
                  name="showVeterinarianContact"
                  labelPlacement="start"
                  label="Show Veterinarian Name"
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
                  label="Show Veterinarian Phone"
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
                  Social Media
                </Typography>

                <RHFSwitch
                  name="showLinkTwitter"
                  labelPlacement="start"
                  label="Show Twitter Link"
                  sx={{
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',
                    width: '100%',
                    mx: 0,
                  }}
                />

                <RHFSwitch
                  name="showLinkFacebook"
                  labelPlacement="start"
                  label="Show Facebook Link"
                  sx={{
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',
                    width: '100%',
                    mx: 0,
                  }}
                />

                <RHFSwitch
                  name="showLinkInstagram"
                  labelPlacement="start"
                  label="Show Instagram Link"
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
            <Box sx={{ maxHeight: '55vh', overflow: 'auto' }}>
              Location Goes here
              {/* <MapView />; */}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <MedicalControlView currentPet={currentPet} />
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update Pet
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
