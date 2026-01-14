import { useState } from 'react';
import { m } from 'framer-motion';
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

export default function FaqsForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

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
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    // Validación de asunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'El asunto debe tener al menos 5 caracteres';
    }

    // Validación de mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
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
        message: 'Por favor corrige los errores en el formulario',
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
        `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
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
        message: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message:
          'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Stack component={MotionViewport} spacing={3} sx={{ width: '100%' }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h4">
            ¿No encontraste la respuesta que buscabas?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Estamos aquí para ayudarte. Completa el formulario y nuestro equipo
            te responderá pronto.
          </Typography>
        </m.div>

        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isSubmitting}
              placeholder="Ej: María Rodríguez"
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Email"
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
              label="Asunto"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              error={!!errors.subject}
              helperText={errors.subject}
              disabled={isSubmitting}
              placeholder="Ej: Consulta sobre placas para perros grandes"
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Escribe tu mensaje aquí"
              name="message"
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              disabled={isSubmitting}
              multiline
              rows={4}
              placeholder="Describe detalladamente tu consulta o pregunta..."
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
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
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
              También puedes escribirnos directamente a: {EMAIL_SUPPORT}
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
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
