// front-end/components/seo/SeoQuickEditForm.tsx
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import { yupResolver } from '@hookform/resolvers/yup';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import { Chip, InputAdornment } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// Interfaces
interface ISeoContent {
  language: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  metaTags?: Array<{
    name: string;
    content: string;
    attribute?: string;
  }>;
  structuredData?: object;
}

interface ISeo {
  _id?: string;
  pageId: string;
  route: string;
  contentType: string;
  contentId?: string;
  multiLanguageContent: ISeoContent[];
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  changeFrequency: string;
  lastModified: Date;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Opciones predefinidas
const SEO_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'draft', label: 'Draft', color: 'warning' },
];

const CONTENT_TYPE_OPTIONS = [
  { value: 'page', label: 'Page' },
  { value: 'product', label: 'Product' },
  { value: 'article', label: 'Article' },
  { value: 'category', label: 'Category' },
  { value: 'landing', label: 'Landing Page' },
];

const CHANGE_FREQUENCY_OPTIONS = [
  { value: 'always', label: 'Always' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'never', label: 'Never' },
];

const LANGUAGE_OPTIONS = [
  { value: 'ES', label: 'Spanish' },
  { value: 'EN', label: 'English' },
  { value: 'FR', label: 'French' },
  { value: 'DE', label: 'German' },
  { value: 'IT', label: 'Italian' },
  { value: 'PT', label: 'Portuguese' },
  { value: 'JA', label: 'Japanese' },
  { value: 'ZH', label: 'Chinese' },
];

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentSeo?: ISeo;
  refetch: () => void;
};

type FormValues = {
  pageId: string;
  route: string;
  contentType: string;
  status: string;
  priority: number;
  changeFrequency: string;
  languages: string[];
  multiLanguageContent: ISeoContent[];
  createdBy?: string;
  updatedBy?: string;
};

export default function SeoQuickEditForm({
  currentSeo,
  open,
  onClose,
  refetch,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();
  const { user } = useManagerUser();

  const seoStatus = SEO_STATUS_OPTIONS.find(
    (option) => option.value === currentSeo?.status
  );

  // Schema de validación simplificado - enfoque en campos principales
  const SeoSchema = Yup.object().shape({
    pageId: Yup.string().required('Page ID is required'),
    route: Yup.string().required('Route is required'),
    contentType: Yup.string().required('Content type is required'),
    status: Yup.string().required('Status is required'),
    priority: Yup.number()
      .min(0.0, 'Priority must be between 0.0 and 1.0')
      .max(1.0, 'Priority must be between 0.0 and 1.0')
      .required('Priority is required'),
    changeFrequency: Yup.string().required('Change frequency is required'),
    languages: Yup.array()
      .of(Yup.string().required())
      .min(1, 'At least one language is required')
      .required('Languages are required'),
    // Simplificamos la validación del contenido multiidioma
    multiLanguageContent: Yup.array().min(
      1,
      'At least one language content is required'
    ),
  });

  const defaultValues: FormValues = useMemo(() => {
    const languages = currentSeo?.multiLanguageContent?.map(
      (content) => content.language
    ) || ['ES'];

    const multiLanguageContent = currentSeo?.multiLanguageContent?.map(
      (content) => ({
        language: content.language,
        title: content.title || '',
        description: content.description || '',
        keywords: content.keywords || [],
        canonicalUrl: content.canonicalUrl || '',
        ogTitle: content.ogTitle || '',
        ogDescription: content.ogDescription || '',
        ogImage: content.ogImage || '',
        metaTags: content.metaTags || [],
        structuredData: content.structuredData || {},
      })
    ) || [
      {
        language: 'ES',
        title: '',
        description: '',
        keywords: [],
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        metaTags: [],
        structuredData: {},
      },
    ];

    return {
      pageId: currentSeo?.pageId || '',
      route: currentSeo?.route || '',
      contentType: currentSeo?.contentType || 'page',
      status: currentSeo?.status || 'draft',
      priority: currentSeo?.priority || 0.5,
      changeFrequency: currentSeo?.changeFrequency || 'weekly',
      languages,
      multiLanguageContent,
    };
  }, [currentSeo]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(SeoSchema) as any,
    defaultValues,
    mode: 'onChange', // Cambiar a 'onChange' para ver validación en tiempo real
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  const watchLanguages = watch('languages');
  const watchMultiLanguageContent = watch('multiLanguageContent');

  // Actualizar contenido multiidioma cuando cambian los idiomas seleccionados
  useMemo(() => {
    if (watchLanguages && watchMultiLanguageContent) {
      const currentLanguages = watchMultiLanguageContent.map(
        (content) => content.language
      );
      const newLanguages = watchLanguages.filter(
        (lang: string) => !currentLanguages.includes(lang)
      );

      if (newLanguages.length > 0) {
        const newContent = [...watchMultiLanguageContent];
        newLanguages.forEach((lang: string) => {
          newContent.push({
            language: lang,
            title: '',
            description: '',
            keywords: [],
            canonicalUrl: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            metaTags: [],
            structuredData: {},
          });
        });
        setValue('multiLanguageContent', newContent, { shouldValidate: true });
      }

      // También eliminar contenido de idiomas que ya no están seleccionados
      const languagesToRemove = currentLanguages.filter(
        (lang: string) => !watchLanguages.includes(lang)
      );
      if (languagesToRemove.length > 0) {
        const filteredContent = watchMultiLanguageContent.filter(
          (content) => !languagesToRemove.includes(content.language)
        );
        setValue('multiLanguageContent', filteredContent, {
          shouldValidate: true,
        });
      }
    }
  }, [watchLanguages, watchMultiLanguageContent, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Submitting data:', data);

      // Filtrar contenido solo para los idiomas seleccionados
      const filteredContent = data.multiLanguageContent.filter((content) =>
        data.languages.includes(content.language)
      );

      const updateData = {
        ...data,
        id: currentSeo?._id,
        multiLanguageContent: filteredContent,
        lastModified: new Date(),
        createdBy: currentSeo?._id ? data.createdBy : user.id,
        updatedBy: user.id,
      };

      const endpoint = currentSeo?._id
        ? `${HOST_API}${endpoints.admin.seo.updateSeoById}`
        : `${HOST_API}${endpoints.admin.seo.createSeo}`;

      const method = currentSeo?._id ? 'PUT' : 'POST';

      await mutateAsync<ISeo>({
        payload: updateData as unknown as ISeo,
        pEndpoint: endpoint,
        method,
      });

      refetch();
      onClose();
      enqueueSnackbar(
        currentSeo?._id
          ? 'SEO updated successfully!'
          : 'SEO created successfully!'
      );
    } catch (error) {
      console.error('Error saving SEO:', error);
      enqueueSnackbar('Error saving SEO data', { variant: 'error' });
    }
  });

  // Función para obtener el contenido por idioma
  const getContentByLanguage = (language: string): ISeoContent | undefined =>
    watchMultiLanguageContent.find((content) => content.language === language);

  // Función para actualizar contenido por idioma
  const updateContentByLanguage = (
    language: string,
    field: string,
    value: any
  ) => {
    const updatedContent = watchMultiLanguageContent.map((content) => {
      if (content.language === language) {
        const updated = { ...content, [field]: value };
        return updated;
      }
      return content;
    });

    setValue('multiLanguageContent', updatedContent, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Función para agregar keyword
  const addKeyword = (language: string, keyword: string) => {
    const content = getContentByLanguage(language);
    if (
      content &&
      keyword.trim() &&
      !content.keywords.includes(keyword.trim())
    ) {
      const updatedKeywords = [...content.keywords, keyword.trim()];
      updateContentByLanguage(language, 'keywords', updatedKeywords);
    }
  };

  // Función para eliminar keyword
  const removeKeyword = (language: string, keywordToRemove: string) => {
    const content = getContentByLanguage(language);
    if (content) {
      const updatedKeywords = content.keywords.filter(
        (keyword) => keyword !== keywordToRemove
      );
      updateContentByLanguage(language, 'keywords', updatedKeywords);
    }
  };

  // Función para manejar el input de keywords
  const handleKeywordInput = (
    language: string,
    event: React.KeyboardEvent<HTMLInputElement> | any
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      if (input.value.trim()) {
        addKeyword(language, input.value.trim());
        input.value = '';
      }
    }
  };

  // Función para manejar el botón add keyword
  const handleAddKeywordClick = (language: string) => {
    const input = document.querySelector(
      `[name="${language}_newKeyword"]`
    ) as HTMLInputElement;
    if (input && input.value.trim()) {
      addKeyword(language, input.value.trim());
      input.value = '';
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 800, maxHeight: '90vh' },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentSeo ? 'Edit SEO' : 'Create SEO'}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            SEO is currently {seoStatus?.label || 'draft'}
          </Alert>

          {/* Mostrar errores generales del formulario */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors in the form before submitting.
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Información básica */}
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="pageId" label="Page ID" />
              <RHFTextField name="route" label="Route" />

              <RHFSelect name="contentType" label="Content Type">
                {CONTENT_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="status" label="Status">
                {SEO_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                name="priority"
                label="Priority"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">0.0-1.0</InputAdornment>
                  ),
                }}
              />

              <RHFSelect name="changeFrequency" label="Change Frequency">
                {CHANGE_FREQUENCY_OPTIONS.map((freq) => (
                  <MenuItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            {/* Selección de idiomas */}
            <Box>
              <RHFAutocomplete
                name="languages"
                label="Languages"
                multiple
                options={LANGUAGE_OPTIONS.map((option) => option.value)}
                getOptionLabel={(option) =>
                  LANGUAGE_OPTIONS.find((lang) => lang.value === option)
                    ?.label || option
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={
                        LANGUAGE_OPTIONS.find((lang) => lang.value === option)
                          ?.label || option
                      }
                      size="small"
                    />
                  ))
                }
              />
            </Box>

            {/* Contenido por idioma */}
            {watchLanguages?.map((language: string) => {
              const content = getContentByLanguage(language);
              const languageLabel =
                LANGUAGE_OPTIONS.find((lang) => lang.value === language)
                  ?.label || language;

              return (
                <Box
                  key={language}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ typography: 'h6', color: 'primary.main' }}>
                      {languageLabel} Content
                    </Box>

                    {/* Title */}
                    <RHFTextField
                      name={`content_${language}_title`}
                      label="Title"
                      value={content?.title || ''}
                      onChange={(e) =>
                        updateContentByLanguage(
                          language,
                          'title',
                          e.target.value
                        )
                      }
                      helperText={`${
                        content?.title?.length || 0
                      }/60 characters`}
                    />

                    {/* Description */}
                    <RHFTextField
                      name={`content_${language}_description`}
                      label="Description"
                      multiline
                      rows={3}
                      value={content?.description || ''}
                      onChange={(e) =>
                        updateContentByLanguage(
                          language,
                          'description',
                          e.target.value
                        )
                      }
                      helperText={`${
                        content?.description?.length || 0
                      }/160 characters`}
                    />

                    {/* Keywords */}
                    <Box>
                      <RHFTextField
                        name={`${language}_newKeyword`}
                        label="Add Keyword"
                        onKeyPress={(e) => handleKeywordInput(language, e)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                onClick={() => handleAddKeywordClick(language)}
                              >
                                Add
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 1 }}
                      >
                        {content?.keywords?.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            size="small"
                            onDelete={() => removeKeyword(language, keyword)}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Open Graph */}
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <RHFTextField
                        name={`content_${language}_ogTitle`}
                        label="OG Title"
                        value={content?.ogTitle || ''}
                        onChange={(e) =>
                          updateContentByLanguage(
                            language,
                            'ogTitle',
                            e.target.value
                          )
                        }
                        helperText={`${
                          content?.ogTitle?.length || 0
                        }/60 characters`}
                      />
                      <RHFTextField
                        name={`content_${language}_ogImage`}
                        label="OG Image URL"
                        value={content?.ogImage || ''}
                        onChange={(e) =>
                          updateContentByLanguage(
                            language,
                            'ogImage',
                            e.target.value
                          )
                        }
                      />
                      <RHFTextField
                        name={`content_${language}_canonicalUrl`}
                        label="Canonical URL"
                        value={content?.canonicalUrl || ''}
                        onChange={(e) =>
                          updateContentByLanguage(
                            language,
                            'canonicalUrl',
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Box>

                    <RHFTextField
                      name={`content_${language}_ogDescription`}
                      label="OG Description"
                      multiline
                      rows={2}
                      value={content?.ogDescription || ''}
                      onChange={(e) =>
                        updateContentByLanguage(
                          language,
                          'ogDescription',
                          e.target.value
                        )
                      }
                      helperText={`${
                        content?.ogDescription?.length || 0
                      }/160 characters`}
                    />
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid} // Deshabilitar si no es válido
          >
            {currentSeo ? 'Update SEO' : 'Create SEO'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
