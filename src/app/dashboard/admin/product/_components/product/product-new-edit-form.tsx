import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { paths } from '@/src/routes/paths';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import Iconify from '@/src/components/iconify';
import useIPInfo from '@/src/hooks/use-ip-info';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrency } from '@/src/hooks/use-currency';
import { countries } from '@/src/assets/data/countries';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { fCurrency, getLocaleCode } from '@/src/utils/format-number';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/src/utils/phone-validation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const { mutateAsync } = useCreateGenericMutation();

  const { symbol } = getLocaleCode();

  const { formatCurrency } = useCurrency();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const isEdit = Boolean(currentProduct);

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const { ipData } = useIPInfo();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, `Price should not be ${fCurrency(0.0)}`),
    priceSale: Yup.number().when('price', {
      is: (price: number) => price > 0,
      then: (schema) =>
        schema.max(
          Yup.ref('price'),
          'Sale price should be less than regular price'
        ),
    }),
    description: Yup.string().required('Description is required'),
    publish: Yup.boolean().required('Publish status is required'),
    // not required
    taxes: Yup.number(),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    country: Yup.string().required('Country is required'),
    sellerWhatsApp: Yup.string()
      .required('Seller WhatsApp is required')
      .test(
        'valid-phone',
        'Please enter a valid phone number for the selected country',
        simplePhoneValidation
      ),
    sellerName: Yup.string().required('Seller Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      publish: currentProduct?.publish === 'published',
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [],
      taxes: currentProduct?.taxes || 0,
      gender: currentProduct?.gender || '',
      category: currentProduct?.category || '',
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
      newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
      country: currentProduct?.country || ipData?.country || '',
      sellerWhatsApp: currentProduct?.sellerWhatsApp || '',
      sellerName: currentProduct?.sellerName || '',
    }),
    [currentProduct, ipData]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const watchCountry = watch('country');
  const sellerWhatsApp = watch('sellerWhatsApp');
  const price = watch('price');
  const priceSale = watch('priceSale');

  // Revalidar el teléfono cuando cambia el país
  useEffect(() => {
    if (sellerWhatsApp && watchCountry) {
      methods.trigger('sellerWhatsApp');
    }
  }, [watchCountry, sellerWhatsApp, methods]);

  // useEffect(() => {
  //   if (ipData?.country) {
  //     setValue('country', ipData.country, { shouldValidate: true });
  //   }
  // }, [ipData, setValue]);

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { images, ...productData } = formData;
      const isPublish = formData.publish ? 'published' : 'draft';

      // Separar correctamente:
      const existingImages =
        images?.filter(
          (image): image is any =>
            typeof image === 'object' &&
            !(image instanceof File) &&
            image.imageURL // ← Solo imágenes con imageURL (ya subidas)
        ) || [];

      const newImageFiles =
        images?.filter(
          (image): image is File =>
            image instanceof File ||
            (typeof image === 'object' && image.preview && !image.imageURL) // ← Archivos nuevos con preview
        ) || [];

      console.log('🖼️ Nuevos archivos:', newImageFiles.length);
      console.log('📸 Imágenes existentes:', existingImages.length);

      if (isEdit) {
        // 🔄 MODO EDICIÓN
        if (newImageFiles.length > 0) {
          // Hay archivos nuevos + imágenes existentes
          await mutateAsync<IProductItem>({
            payload: {
              ...productData,
              publish: isPublish,
              id: currentProduct?.id,
              existingImages, // ← Imágenes ya subidas
              images: newImageFiles, // ← Archivos nuevos a subir
            } as unknown as IProductItem,
            pEndpoint: `${HOST_API}${endpoints.admin.product.updateProduct}`,
            method: 'PUT',
            isFormData: true,
          });
        } else {
          // Solo imágenes existentes (sin archivos nuevos)
          await mutateAsync<IProductItem>({
            payload: {
              ...productData,
              publish: isPublish,
              id: currentProduct?.id,
              existingImages, // ← Solo las existentes
              // images: [], // ← Array vacío para nuevos
            } as unknown as IProductItem,
            pEndpoint: `${HOST_API}${endpoints.admin.product.updateProduct}`,
            method: 'PUT',
            isFormData: false,
          });
        }
      } else {
        // 🆕 MODO CREACIÓN
        // eslint-disable-next-line no-lonely-if
        if (newImageFiles.length > 0) {
          await mutateAsync<IProductItem>({
            payload: {
              ...productData,
              // ELIMINAR existingImages: [] y enviar directamente
              publish: 'draft',
              images: newImageFiles,
            } as unknown as IProductItem,
            pEndpoint: `${HOST_API}${endpoints.admin.product.createProduct}`,
            method: 'POST',
            isFormData: true,
          });
        } else {
          await mutateAsync<IProductItem>({
            payload: {
              ...productData,
              publish: 'draft',
              // ELIMINAR existingImages: [] y images: []
            } as unknown as IProductItem,
            pEndpoint: `${HOST_API}${endpoints.admin.product.createProduct}`,
            method: 'POST',
            isFormData: false, // O true si siempre usas FormData
          });
        }
      }

      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.admin.product.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        `Error ${isEdit ? 'updating' : 'creating'} product: ${
          error.errors ? error.errors.join(', ') : error.message
        }`,
        {
          variant: 'error',
          autoHideDuration: 8000,
        }
      );
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string | any) => {
      const currentImages = values.images || [];

      const filtered = currentImages.filter((file) => {
        // Función para obtener identificador único de cada archivo
        const getFileKey = (f: any): string => {
          if (typeof f === 'string') return f;
          return (
            f._id ||
            f.id ||
            f.image_id ||
            f.imageURL ||
            f.preview ||
            `${f.name}-${f.size}`
          );
        };

        return getFileKey(file) !== getFileKey(inputFile);
      });

      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTaxes(event.target.checked);
    },
    []
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField
              name="subDescription"
              label="Sub Description"
              multiline
              rows={4}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

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
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect
                native
                name="category"
                label="Category"
                InputLabelProps={{ shrink: true }}
              >
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect
                checkbox
                name="sizes"
                label="Sizes"
                options={PRODUCT_SIZE_OPTIONS}
              />
            </Box>

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox
                row
                name="gender"
                spacing={2}
                options={PRODUCT_GENDER_OPTIONS}
              />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
              placeholder={formatCurrency(0.0)}
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      {symbol}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder={formatCurrency(0.0)}
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      {symbol}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ typography: 'subtitle1' }}
            >
              <span>Preview Price:</span>
              {price && (
                <Box
                  component="span"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatCurrency(price)}
                </Box>
              )}
              {priceSale && (
                <Box component="span">{formatCurrency(priceSale)}</Box>
              )}
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={includeTaxes}
                  onChange={handleChangeIncludeTaxes}
                />
              }
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderSellerInformation = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Seller Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Details about the seller...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Seller Information" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Aquí puedes agregar campos relacionados con la información del vendedor */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
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
                name="sellerWhatsApp"
                label="Phone Number"
                placeholder={getPhonePlaceholder(watchCountry, 'Phone number')}
                helperText={getPhoneHelperText(watchCountry, sellerWhatsApp)}
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
                          {`${
                            countries
                              .find(
                                (c) =>
                                  c.label.toLowerCase() ===
                                  watchCountry?.toLowerCase()
                              )
                              ?.phone.toLowerCase() || ''
                          }`}{' '}
                          )
                        </Box>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField name="sellerName" label="Seller Name" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

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
        }}
      >
        <RHFSwitch
          name="publish"
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
          labelPlacement="start"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderSellerInformation}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
