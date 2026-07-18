'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Rating,
  TextField,
  Typography,
  Container,
  Chip,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Paper,
} from '@mui/material';

import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import Iconify from '@/components/iconify';
import { HOST_API } from '@/config-global';
import { useRouter } from '@/routes/hooks';
import { useSnackbar } from '@/components/snackbar';
import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';
import { LoadingScreen } from '@/components/loading-screen';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

// Áreas de mejora - MOVER FUERA del componente
const IMPROVEMENT_AREAS = [
  { value: 'product_quality', label: 'Product Quality' },
  { value: 'delivery_time', label: 'Delivery Time' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'website', label: 'Website / App' },
  { value: 'pricing', label: 'Pricing / Costs' },
  { value: 'communication', label: 'Communication' },
  { value: 'other', label: 'Other' },
];

// Iconos para cada calificación - MOVER FUERA del componente
const RATING_ICONS: Record<number, string> = {
  1: 'mdi:emoticon-sad-outline',
  2: 'mdi:emoticon-neutral-outline',
  3: 'mdi:emoticon-neutral-outline',
  4: 'mdi:emoticon-happy-outline',
  5: 'mdi:emoticon-excited-outline',
};

interface FeedbackFormData {
  rating: number | null;
  reason: string;
  improvements: string[];
  email: string;
  phone: string;
  comments: string;
  consent: boolean;
}

export default function FeedbackForm() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useManagerUser();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutateAsync } = useCreateGenericMutation();

  // Estados
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: null,
    reason: '',
    improvements: [],
    email: '',
    phone: '',
    comments: '',
    consent: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FeedbackFormData, string>>
  >({});

  // ✅ Usar useMemo para las etiquetas traducidas (solo se recalcula cuando cambia t)
  const RATING_LABELS = useMemo<Record<number, string>>(
    () => ({
      1: t('Very dissatisfied'),
      2: t('Dissatisfied'),
      3: t('Neutral'),
      4: t('Satisfied'),
      5: t('Very satisfied'),
    }),
    [t]
  );

  // ✅ Usar useMemo para funciones que dependen de RATING_LABELS
  const getRatingLabel = useMemo(() => {
    return (value: number | null) => {
      if (!value) return '';
      return RATING_LABELS[value] || '';
    };
  }, [RATING_LABELS]);

  const getRatingIcon = useMemo(() => {
    return (value: number | null) => {
      if (!value) return 'mdi:star-outline';
      return RATING_ICONS[value] || 'mdi:star-outline';
    };
  }, []);

  // ✅ Prellenar email - dependencia correcta
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || '' }));
    }
  }, [user?.email]); // ✅ Dependencia específica

  // ✅ Client-side only - se ejecuta solo una vez
  useEffect(() => {
    setIsClient(true);
  }, []); // ✅ Array vacío

  const handleChange = (field: keyof FeedbackFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleRatingChange = (value: number | null) => {
    handleChange('rating', value);
  };

  const handleImprovementToggle = (value: string) => {
    setFormData((prev) => {
      const current = prev.improvements;
      const index = current.indexOf(value);
      if (index === -1) {
        return { ...prev, improvements: [...current, value] };
      } else {
        return {
          ...prev,
          improvements: current.filter((item) => item !== value),
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FeedbackFormData, string>> = {};

    if (formData.rating === null) {
      newErrors.rating = t('Please give a rating');
      enqueueSnackbar(t('Please give a rating'), {
        variant: 'error',
      });
    }

    if (
      formData.rating !== null &&
      formData.rating <= 3 &&
      !formData.reason.trim()
    ) {
      newErrors.reason = t('Please tell us why you gave this rating');
      enqueueSnackbar(t('Please tell us why you gave this rating'), {
        variant: 'error',
      });
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('Please enter a valid email address');
      enqueueSnackbar(t('Please enter a valid email address'), {
        variant: 'error',
      });
    }

    if (formData.phone && !/^[+]?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = t('Please enter a valid phone number');
      enqueueSnackbar(t('Please enter a valid phone number'), {
        variant: 'error',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const feedbackData = {
        type: 'general_feedback',
        rating: formData.rating,
        reason: formData.reason,
        improvements: formData.improvements,
        comments: formData.comments,
        contact: {
          email: formData.email,
          phone: formData.phone,
          consent: formData.consent,
        },
        user: {
          id: user?._id,
          email: user?.email,
          name: user?.profile?.firstName || user?.displayName,
        },
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          timestamp: new Date().toISOString(),
          trigger: 'manual',
        },
      };

      const endpoint = `${HOST_API}${endpoints.user.submitFeedback}`;

      await mutateAsync<any>({
        payload: feedbackData as any,
        pEndpoint: endpoint,
        method: 'POST',
      });

      setSubmitted(true);
      enqueueSnackbar(t('Thank you for your feedback! It helps us improve.'), {
        variant: 'success',
        autoHideDuration: 4000,
      });

      setTimeout(() => {
        router.push(paths.dashboard.root);
      }, 3000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      enqueueSnackbar(t('Error sending feedback. Please try again.'), {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Si ya se envió, mostrar mensaje de éxito
  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            border: '2px solid',
            borderColor: 'success.main',
            bgcolor: alpha(theme.palette.success.main, 0.04),
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.success.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
              }}
            >
              <Iconify
                icon="mdi:check-circle"
                width={48}
                sx={{ color: 'success.main' }}
              />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            {t('Thank you for your feedback!')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t(
              'Your feedback is very important to us and helps us continuously improve.'
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('You will be automatically redirected...')}
          </Typography>
          <LinearProgress sx={{ mt: 3, maxWidth: 300, mx: 'auto' }} />
        </Paper>
      </Container>
    );
  }

  // No renderizar en el servidor
  if (!isClient) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      {loading && <LoadingScreen />}

      {/* Header */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} />}
          onClick={handleBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('Volver')}
        </Button>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box
            sx={{
              bgcolor: 'primary.light',
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify
              icon="mdi:message-star-outline"
              width={40}
              sx={{ color: 'primary.main' }}
            />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {t('How was your experience?')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t(
                'Your feedback helps us improve and provide you with better service'
              )}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Formulario */}
      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={4}>
          {/* A. Calificación General */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t(
                '1. How would you rate your overall experience with our service?'
              )}
              <Typography
                component="span"
                sx={{ color: 'error.main', ml: 0.5 }}
              >
                *
              </Typography>
            </Typography>

            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Rating
                  value={formData.rating}
                  onChange={(_, value) => handleRatingChange(value)}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'warning.main',
                    },
                    '& .MuiRating-iconHover': {
                      color: 'warning.light',
                    },
                  }}
                />
                {formData.rating && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify
                      icon={getRatingIcon(formData.rating)}
                      width={24}
                      sx={{
                        color:
                          formData.rating >= 4
                            ? 'success.main'
                            : formData.rating >= 3
                              ? 'warning.main'
                              : 'error.main',
                      }}
                    />
                    <Chip
                      label={getRatingLabel(formData.rating)}
                      size="medium"
                      color={
                        formData.rating >= 4
                          ? 'success'
                          : formData.rating >= 3
                            ? 'warning'
                            : 'error'
                      }
                      variant="filled"
                    />
                  </Stack>
                )}
              </Stack>
              {errors.rating && (
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {errors.rating}
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* B. Pregunta Abierta Específica */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {t('2. What was the main reason for your grade?')}
              {formData.rating !== null && formData.rating <= 3 && (
                <Typography
                  component="span"
                  sx={{ color: 'error.main', ml: 0.5 }}
                >
                  *
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('Tell us what you liked best or what we can improve')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t('Write your comment here...')}
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              error={!!errors.reason}
              helperText={errors.reason}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                },
              }}
            />
            {formData.rating !== null && formData.rating <= 3 && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
              >
                {t('* This field is required for low grades')}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* C. Áreas de Oportunidad */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t('3. In what areas do you think we can improve?')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('Select all the options you consider relevant')}
            </Typography>
            <FormGroup>
              <Grid container spacing={1}>
                {IMPROVEMENT_AREAS.map((area) => (
                  <Grid key={area.value} size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.improvements.includes(area.value)}
                          onChange={() => handleImprovementToggle(area.value)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">{t(area.label)}</Typography>
                      }
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Box>

          <Divider />

          {/* D. Comentarios Adicionales */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t('4. Additional Comments')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={t(
                'Is there anything else youd like to share with us?'
              )}
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                },
              }}
            />
          </Box>

          <Divider />

          {/* E. Datos de Contacto */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t('5. Contact information (optional)')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t(
                'If you would like us to contact you to follow up on your comments'
              )}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label={t('Email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                placeholder={t('tu@email.com')}
                InputProps={{
                  startAdornment: (
                    <Iconify
                      icon="mdi:email-outline"
                      width={20}
                      sx={{ mr: 1, color: 'text.secondary' }}
                    />
                  ),
                }}
              />

              <TextField
                label={t('Phone Number')}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                placeholder={t('+506 1234-5678')}
                InputProps={{
                  startAdornment: (
                    <Iconify
                      icon="mdi:phone-outline"
                      width={20}
                      sx={{ mr: 1, color: 'text.secondary' }}
                    />
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.consent}
                    onChange={(e) => handleChange('consent', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('I agree to be contacted to follow up on my feedback')}
                  </Typography>
                }
              />
            </Stack>
          </Box>

          {/* Botones de acción */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              fullWidth
              size="large"
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              size="large"
              startIcon={<Iconify icon="mdi:send" />}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {loading ? t('Sending...') : t('Send Feedback')}
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Footer informativo */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t(
            'Your information is secure and will be used solely to improve our service'
          )}
        </Typography>
      </Box>
    </Container>
  );
}
