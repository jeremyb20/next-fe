// components/feedback/FeedbackButton.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';

import { endpoints } from '@/utils/axios';
import Iconify from '@/components/iconify';
import { HOST_API } from '@/config-global';
import { useSnackbar } from '@/components/snackbar';
import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

// Tipos de reporte
type FeedbackType = 'improvement' | 'bug' | 'suggestion' | 'question';

interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  attachments: File[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'improvement', label: 'Improvement', icon: 'mdi:lightbulb-outline' },
  { value: 'bug', label: 'Bug Report', icon: 'mdi:bug-outline' },
  { value: 'suggestion', label: 'Suggestion', icon: 'mdi:comment-outline' },
  { value: 'question', label: 'Question', icon: 'mdi:help-circle-outline' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'info' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' },
];

const CATEGORIES = [
  'UI/UX',
  'Performance',
  'Functionality',
  'Content',
  'Security',
  'Mobile',
  'Desktop',
  'Other',
];

export default function FeedbackButton() {
  const { t } = useTranslation();
  const { mutateAsync } = useCreateGenericMutation();
  const { user } = useManagerUser();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'improvement',
    title: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    attachments: [],
    priority: 'medium',
    category: 'Other',
  });

  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      type: 'improvement',
      title: '',
      description: '',
      steps: '',
      expected: '',
      actual: '',
      attachments: [],
      priority: 'medium',
      category: 'Other',
    });
    setErrors({});
  };

  const handleChange = (field: keyof FeedbackFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('Title is required');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('Description is required');
    }
    if (formData.type === 'bug' && !formData.steps.trim()) {
      newErrors.steps = t('Steps to reproduce are required for bugs');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Preparar datos para enviar
      const feedbackData = {
        ...formData,
        user: {
          id: user?._id,
          email: user?.email,
          name: user?.profile?.firstName || user?.displayName,
          phone: user?.profile?.phone,
        },
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          timestamp: new Date().toISOString(),
        },
      };

      // Enviar al backend
      // await axios.post(`${HOST_API}/api/feedback`, feedbackData);

      await mutateAsync<any>({
        payload: feedbackData as any,
        pEndpoint: `${HOST_API}${endpoints.user.submitFeedback}`,
        method: 'POST',
      });

      setSuccess(true);
      enqueueSnackbar(t('Thank you for your feedback!'), {
        variant: 'success',
      });

      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      enqueueSnackbar(t('Error sending feedback. Please try again.'), {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <Tooltip title={t('Report a problem or suggest an improvement')} arrow>
        {/* <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            boxShadow: 4,
          }}
        >
          <Iconify icon="mdi:message-bulb-outline" width={28} />
        </Fab> */}
        <Button variant="contained" fullWidth onClick={handleOpen}>
          Comentarios y mejoras
          <Iconify icon="mdi:message-bulb-outline" width={28} />
        </Button>
      </Tooltip>

      {/* Diálogo de feedback */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                bgcolor: 'primary.light',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon="mdi:message-bulb-outline"
                width={28}
                color="primary.main"
              />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('Feedback & Improvements')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('Help us make the platform better')}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Tipo de feedback */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                {t('What type of feedback?')} *
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {FEEDBACK_TYPES.map((type) => (
                  <Chip
                    key={type.value}
                    label={t(type.label)}
                    icon={<Iconify icon={type.icon} width={18} />}
                    onClick={() => handleChange('type', type.value)}
                    color={formData.type === type.value ? 'primary' : 'default'}
                    variant={
                      formData.type === type.value ? 'filled' : 'outlined'
                    }
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Prioridad y categoría */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  {t('Priority')}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: `${option.color}.main`,
                          }}
                        />
                        <Typography>{t(option.label)}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  {t('Category')}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Stack>

            {/* Título */}
            <TextField
              label={t('Title')}
              placeholder={t('Brief summary of your feedback')}
              fullWidth
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              size="small"
            />

            {/* Descripción */}
            <TextField
              label={t('Description')}
              placeholder={t('Describe your feedback in detail')}
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              size="small"
            />

            {/* Campos específicos para bugs */}
            {formData.type === 'bug' && (
              <>
                <TextField
                  label={t('Steps to Reproduce')}
                  placeholder={t(
                    '1. Go to...\n2. Click on...\n3. See error...'
                  )}
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.steps}
                  onChange={(e) => handleChange('steps', e.target.value)}
                  error={!!errors.steps}
                  helperText={errors.steps}
                  size="small"
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label={t('Expected Result')}
                    placeholder={t('What should have happened?')}
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.expected}
                    onChange={(e) => handleChange('expected', e.target.value)}
                    size="small"
                  />

                  <TextField
                    label={t('Actual Result')}
                    placeholder={t('What actually happened?')}
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.actual}
                    onChange={(e) => handleChange('actual', e.target.value)}
                    size="small"
                  />
                </Stack>
              </>
            )}

            {/* Información del usuario (solo lectura) */}
            <Box
              sx={{
                bgcolor: 'background.neutral',
                p: 2,
                borderRadius: 2,
                mt: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('User Information (automatically sent)')}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ mt: 0.5 }}
              >
                <Chip
                  size="small"
                  label={user?.email || 'Not logged in'}
                  icon={<Iconify icon="mdi:email" width={14} />}
                />
                <Chip
                  size="small"
                  label={user?.profile?.firstName || 'Guest'}
                  icon={<Iconify icon="mdi:account" width={14} />}
                />
                <Chip
                  size="small"
                  label={window.location.hostname}
                  icon={<Iconify icon="mdi:web" width={14} />}
                />
              </Stack>
            </Box>

            {loading && <LinearProgress />}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} color="inherit">
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={<Iconify icon="mdi:send" />}
            sx={{
              px: 3,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            {loading ? t('Sending...') : t('Send Feedback')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {t("Thanks for your feedback! We'll review it shortly.")}
        </Alert>
      </Snackbar>
    </>
  );
}
