import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EMAIL_SUPPORT } from '@/src/config-global';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isClient, setIsClient] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación de nombre
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'The name must have at least 2 characters.';
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
    }

    // Validación de asunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'The subject must be at least 5 characters long.';
    }

    // Validación de mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'The message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'The message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Aquí iría la llamada a tu API
      // Ejemplo:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulación de envío exitoso (reemplaza esto con tu lógica real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Envío por email usando mailto como fallback
      const mailtoLink = `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `${t('Name')}: ${formData.name}\nEmail: ${
          formData.email
        }\n\nMensaje:\n${formData.message}`
      )}`;
      window.open(mailtoLink, '_blank');

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setSnackbar({
        open: true,
        message: 'Message sent successfully! We will contact you shortly.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'There was an error sending the message. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <Box>
          <Stack component={MotionViewport} spacing={3} sx={{ width: '100%' }}>
            <m.div variants={varFade().inUp}>
              <Typography variant="h4">
                {t('Feel free to contact us.')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {t('We would love to hear from you, friend')}
              </Typography>
            </m.div>

            <Stack component="form" onSubmit={handleSubmit} spacing={3}>
              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Full Name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={isSubmitting}
                  placeholder={t('Ex: María Rodríguez')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Email address')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                  placeholder="Ej: tu@email.com"
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  disabled={isSubmitting}
                  placeholder={t('Example: Inquiry about tags for large dogs')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Write your message here')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  disabled={isSubmitting}
                  multiline
                  rows={4}
                  placeholder={t(
                    'Describe your query or question in detail...'
                  )}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <Box sx={{ position: 'relative' }}>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ minWidth: 180 }}
                    startIcon={isSubmitting ? null : undefined}
                  >
                    {isSubmitting ? t('Sending...') : t('Send Message')}
                  </Button>
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {t('You can also write to us directly at')}: {EMAIL_SUPPORT}
                </Typography>
              </m.div>
            </Stack>
          </Stack>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {t(snackbar.message)}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
}
