// components/admin/promotion/promotion-edit-form.tsx
import * as Yup from 'yup';
import { IPromotions } from '@/types/api';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/utils/axios';
import { HOST_API } from '@/config-global';
import Iconify from '@/components/iconify';
import { useSnackbar } from '@/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from '@/hooks/use-responsive';
import { useMemo, Dispatch, useEffect, SetStateAction } from 'react';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
} from '@/components/hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, Button, MenuItem, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentPromotion?: IPromotions;
  close: Dispatch<SetStateAction<boolean>>;
  refetchAll?: () => void;
};

// Tipo del formulario
type FormValues = {
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  urlImage?: string;
  urlImageId?: string;
  icon?: string;
  status: 'active' | 'inactive' | 'expired';
  priority: number;
  type: 'vaccine' | 'grooming' | 'consultation' | 'products' | 'general';
  termsAndConditions?: string;
  applicableTo: string[];
  code?: string;
  usageLimit?: number;
  link?: string;
};

// Opciones para selects
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
];

const typeOptions = [
  { value: 'vaccine', label: 'Vaccination', icon: 'mdi:needle' },
  { value: 'grooming', label: 'Grooming', icon: 'mdi:scissors' },
  { value: 'consultation', label: 'Consultation', icon: 'mdi:doctor' },
  { value: 'products', label: 'Products', icon: 'mdi:shopping' },
  { value: 'general', label: 'General', icon: 'mdi:tag' },
];

const iconOptions = [
  { value: 'mdi:tag', label: 'Tag' },
  { value: 'mdi:gift', label: 'Gift' },
  { value: 'mdi:sale', label: 'Sale' },
  { value: 'mdi:percent', label: 'Percent' },
  { value: 'mdi:star', label: 'Star' },
  { value: 'mdi:heart', label: 'Heart' },
  { value: 'mdi:paw', label: 'Paw' },
  { value: 'mdi:needle', label: 'Needle' },
  { value: 'mdi:scissors', label: 'Scissors' },
  { value: 'mdi:doctor', label: 'Doctor' },
];

// Servicios aplicables (ejemplo)
const applicableServices = [
  { value: 'vaccination_complete', label: 'Complete Vaccination' },
  { value: 'vaccination_booster', label: 'Booster Vaccination' },
  { value: 'grooming_basic', label: 'Basic Grooming' },
  { value: 'grooming_premium', label: 'Premium Grooming' },
  { value: 'consultation_general', label: 'General Consultation' },
  { value: 'consultation_emergency', label: 'Emergency Consultation' },
  { value: 'products_food', label: 'Pet Food' },
  { value: 'products_accessories', label: 'Accessories' },
  { value: 'products_medicines', label: 'Medicines' },
];

export default function PromotionEditForm({
  currentPromotion,
  close,
  refetchAll,
}: Props) {
  const { mutateAsync } = useCreateGenericMutation();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();

  // Schema de validación
  const PromotionSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    discount: Yup.number()
      .required('Discount is required')
      .min(0, 'Discount must be at least 0%')
      .max(100, 'Discount cannot exceed 100%'),
    validFrom: Yup.string().required('Start date is required'),
    validUntil: Yup.string()
      .required('End date is required')
      .test(
        'is-after-validFrom',
        'End date must be after start date',
        (value, context) => {
          const { validFrom } = context.parent;
          if (!validFrom || !value) return true;
          return new Date(value) > new Date(validFrom);
        }
      ),
    urlImage: Yup.string().optional(),
    urlImageId: Yup.string().optional(),
    icon: Yup.string().optional().default('mdi:tag'),
    status: Yup.string()
      .oneOf(['active', 'inactive', 'expired'])
      .required('Status is required'),
    priority: Yup.number().min(0, 'Priority must be 0 or higher').default(0),
    type: Yup.string()
      .oneOf(['vaccine', 'grooming', 'consultation', 'products', 'general'])
      .required('Type is required'),
    termsAndConditions: Yup.string().optional(),
    applicableTo: Yup.array().of(Yup.string()).optional().default([]),
    code: Yup.string()
      .optional()
      .matches(
        /^[A-Z0-9]*$/,
        'Code can only contain uppercase letters and numbers'
      )
      .max(20, 'Code must not exceed 20 characters'),
    usageLimit: Yup.number()
      .optional()
      .min(1, 'Usage limit must be at least 1')
      .nullable(),
    link: Yup.string().optional().url('Must be a valid URL'),
  });

  const defaultValues = useMemo(
    (): FormValues => ({
      title: currentPromotion?.title || '',
      description: currentPromotion?.description || '',
      discount: currentPromotion?.discount || 0,
      validFrom: currentPromotion?.validFrom
        ? new Date(currentPromotion.validFrom).toISOString().slice(0, 16)
        : '',
      validUntil: currentPromotion?.validUntil
        ? new Date(currentPromotion.validUntil).toISOString().slice(0, 16)
        : '',
      urlImage: currentPromotion?.urlImage || '',
      urlImageId: currentPromotion?.urlImageId || '',
      icon: currentPromotion?.icon || 'mdi:tag',
      status: currentPromotion?.status || 'inactive',
      priority: currentPromotion?.priority || 0,
      type: currentPromotion?.type || 'general',
      termsAndConditions: currentPromotion?.termsAndConditions || '',
      applicableTo: currentPromotion?.applicableTo || [],
      code: currentPromotion?.code || '',
      usageLimit: currentPromotion?.usageLimit || undefined,
      link: currentPromotion?.link || '',
    }),
    [currentPromotion]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(PromotionSchema) as any,
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const watchCode = watch('code');
  const watchHasImage = watch('urlImage');

  useEffect(() => {
    if (currentPromotion) {
      reset(defaultValues);
    }
  }, [currentPromotion, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateData = {
        ...data,
        ...(currentPromotion?._id && { id: currentPromotion._id }),
      };

      const endpoint = currentPromotion?._id
        ? `${HOST_API}${endpoints.admin.promotions.updatePromotion}/${currentPromotion._id}`
        : `${HOST_API}${endpoints.admin.promotions.createPromotion}`;

      await mutateAsync<IPromotions>({
        payload: updateData as any,
        pEndpoint: endpoint,
        method: currentPromotion?._id ? 'PUT' : 'POST',
      });

      close(false);
      enqueueSnackbar(
        currentPromotion?._id
          ? 'Promotion updated successfully!'
          : 'Promotion created successfully!',
        { variant: 'success' }
      );
      refetchAll?.();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        currentPromotion?._id
          ? 'Error updating promotion!'
          : 'Error creating promotion!',
        { variant: 'error' }
      );
    }
  });

  // Renderizado de información básica
  const renderBasicInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Basic Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Promotion title, description and discount details
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Basic Information" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="title" label="Title" required />
              <RHFTextField
                name="discount"
                label="Discount (%)"
                type="number"
                required
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Box>

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={3}
              required
            />

            {/* Link opcion */}
            <RHFTextField name="link" label="URL link" multiline required />

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="validFrom"
                label="Valid From"
                type="datetime-local"
                required
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="validUntil"
                label="Valid Until"
                type="datetime-local"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect name="status" label="Status" required>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                name="priority"
                label="Priority"
                type="number"
                helperText="Higher number = more important"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Renderizado de tipo e imagen
  const renderTypeAndImage = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Type & Image
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Promotion category and visual appearance
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Type & Image" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect name="type" label="Promotion Type" required>
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon={option.icon} width={20} />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="icon" label="Icon">
                {iconOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon={option.value} width={20} />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Promotion Image
              </Typography>
              <RHFUpload
                name="urlImage"
                thumbnail
                accept={{ 'image/*': [] }}
                onDrop={(acceptedFiles) => {
                  // Aquí deberías implementar la subida a Cloudinary
                  console.log('Files to upload:', acceptedFiles);
                }}
              />
              {watchHasImage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Current image:
                  </Typography>
                  <Box
                    component="img"
                    src={watchHasImage}
                    alt="Promotion"
                    sx={{
                      mt: 1,
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Renderizado de código promocional
  const renderPromoCode = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Promo Code
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Optional discount code with usage limits
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Promo Code" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="code"
                label="Promo Code"
                placeholder="e.g., SUMMER2024"
                helperText="Uppercase letters and numbers only, no spaces"
              />
              <RHFTextField
                name="usageLimit"
                label="Usage Limit"
                type="number"
                placeholder="Unlimited"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            {watchCode && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Code Preview:</Typography>
                  <Chip
                    label={watchCode}
                    color="primary"
                    variant="outlined"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Stack>
              </Box>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Renderizado de servicios aplicables
  const renderApplicableServices = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Applicable Services
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select which services this promotion applies to
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Applicable Services" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {applicableServices.map((service) => {
                const isSelected = watch('applicableTo')?.includes(
                  service.value
                );
                return (
                  <Chip
                    key={service.value}
                    label={service.label}
                    onClick={() => {
                      const current = watch('applicableTo') || [];
                      if (isSelected) {
                        setValue(
                          'applicableTo',
                          current.filter((v) => v !== service.value)
                        );
                      } else {
                        setValue('applicableTo', [...current, service.value]);
                      }
                    }}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Box>
            {errors.applicableTo && (
              <FormHelperText error>
                {errors.applicableTo.message}
              </FormHelperText>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Renderizado de términos y condiciones
  const renderTermsAndConditions = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Terms & Conditions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional terms and restrictions
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Terms & Conditions" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFEditor name="termsAndConditions" simple />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // Renderizado de acciones
  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Button variant="outlined" size="large" onClick={() => close(false)}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {currentPromotion?._id ? 'Save Changes' : 'Create Promotion'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderBasicInfo}
        {renderTypeAndImage}
        {renderPromoCode}
        {renderApplicableServices}
        {renderTermsAndConditions}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
