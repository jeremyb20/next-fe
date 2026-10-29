import { m } from 'motion/react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
import { EMAIL_SUPPORT, PHONE_SUPPORT } from '@/config-global';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

const WHATSAPP_NUMBER = PHONE_SUPPORT.replace(/\D/g, '');

const BUSINESS_TYPES = [
  { value: 'veterinary-clinic', label: 'Veterinary clinic' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'pet-shop', label: 'Pet shop' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'other', label: 'Other' },
];

interface AffiliationFormData {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  message: string;
}

interface FormErrors {
  businessName?: string;
  businessType?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const INITIAL_FORM_DATA: AffiliationFormData = {
  businessName: '',
  businessType: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  message: '',
};

export default function ContactForm() {
  const { t } = useTranslation();

  const [formData, setFormData] =
    useState<AffiliationFormData>(INITIAL_FORM_DATA);

  const [isClient, setIsClient] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const getBusinessTypeLabel = () =>
    BUSINESS_TYPES.find((type) => type.value === formData.businessType)?.label;

  const buildRequestMessage = () => {
    const businessType = getBusinessTypeLabel();

    return [
      `${t('Affiliation request')}`,
      '',
      `${t('Business or venture name')}: ${formData.businessName}`,
      `${t('Business type')}: ${businessType ? t(businessType) : '-'}`,
      `${t('Contact name')}: ${formData.contactName}`,
      `${t('Email address')}: ${formData.email}`,
      `${t('WhatsApp number')}: ${formData.phone}`,
      `${t('Website or social media (optional)')}: ${formData.website || '-'}`,
      `${t('Province, canton or service area')}: ${formData.location || '-'}`,
      '',
      `${t('Message')}:`,
      formData.message,
    ].join('\n');
  };

  const hasFormData = () =>
    Object.values(formData).some((value) => value.trim().length > 0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business or venture name is required';
    } else if (formData.businessName.trim().length < 2) {
      newErrors.businessName =
        'The business or venture name must have at least 2 characters.';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    } else if (formData.contactName.trim().length < 2) {
      newErrors.contactName =
        'The contact name must have at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
    }

    if (!phoneDigits) {
      newErrors.phone = 'WhatsApp number is required';
    } else if (phoneDigits.length < 8) {
      newErrors.phone = 'Enter a valid WhatsApp number with at least 8 digits.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Tell us about your business or venture.';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'The message must be at least 20 characters long.';
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

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      const subject = `${t('Affiliation request')} - ${formData.businessName}`;
      const mailtoLink = `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(buildRequestMessage())}`;

      window.location.href = mailtoLink;

      setFormData(INITIAL_FORM_DATA);

      setSnackbar({
        open: true,
        message: 'Your email app has been opened with the affiliation request.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error sending affiliation request:', error);
      setSnackbar({
        open: true,
        message: 'There was an error sending the message. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (hasFormData() && !validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
      return;
    }

    const message = hasFormData()
      ? buildRequestMessage()
      : t('Hello, I would like to affiliate my business.');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
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
                {t('Affiliate your business with us')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {t(
                  'Join our network of companies and entrepreneurs. Complete the form and we will contact you to start the affiliation process.'
                )}
              </Typography>
            </m.div>

            <Stack
              noValidate
              component="form"
              onSubmit={handleSubmit}
              spacing={3}
            >
              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  label={t('Business or venture name')}
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  error={!!errors.businessName}
                  helperText={errors.businessName ? t(errors.businessName) : ''}
                  disabled={isSubmitting}
                  placeholder={t('Ex: Vet Clinic San José')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  select
                  label={t('Business type')}
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  error={!!errors.businessType}
                  helperText={
                    errors.businessType ? t(errors.businessType) : ''
                  }
                  disabled={isSubmitting}
                >
                  <MenuItem value="" disabled>
                    {t('Select an option')}
                  </MenuItem>
                  {BUSINESS_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {t(type.label)}
                    </MenuItem>
                  ))}
                </TextField>
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  label={t('Contact name')}
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  error={!!errors.contactName}
                  helperText={errors.contactName ? t(errors.contactName) : ''}
                  disabled={isSubmitting}
                  placeholder={t('Ex: María Rodríguez')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  label={t('Email address')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email ? t(errors.email) : ''}
                  disabled={isSubmitting}
                  placeholder={t('Ex: your@email.com')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  label={t('WhatsApp number')}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone ? t(errors.phone) : ''}
                  disabled={isSubmitting}
                  placeholder={t('Ex: +506 8888 8888')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Website or social media (optional)')}
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder={t('Ex: https://instagram.com/yourbusiness')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  label={t('Province, canton or service area')}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder={t('Ex: San José, Desamparados')}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <TextField
                  fullWidth
                  required
                  label={t('Tell us about your business')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message ? t(errors.message) : ''}
                  disabled={isSubmitting}
                  multiline
                  rows={4}
                  placeholder={t(
                    'Tell us what you do, your experience and why you want to join PlaquitasCR.'
                  )}
                />
              </m.div>

              <m.div variants={varFade().inUp}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      type="button"
                      onClick={handleWhatsApp}
                      disabled={isSubmitting}
                      startIcon={
                        <Iconify icon="mdi:whatsapp" width={24} />
                      }
                      sx={{
                        bgcolor: '#25D366',
                        '&:hover': {
                          bgcolor: '#128C7E',
                        },
                      }}
                    >
                      {t('Send request by WhatsApp')}
                    </Button>

                    <Box
                      sx={{
                        position: 'relative',
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ minWidth: { sm: 210 } }}
                        startIcon={
                          <Iconify icon="solar:letter-bold" width={22} />
                        }
                      >
                        {isSubmitting
                          ? t('Sending...')
                          : t('Send request by email')}
                      </Button>
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 16,
                            marginTop: '-12px',
                          }}
                        />
                      )}
                    </Box>
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    {t('You can also write to us directly at')}:{' '}
                    <Link
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#128C7E', fontWeight: 600 }}
                    >
                      {t('WhatsApp')} {PHONE_SUPPORT}
                    </Link>{' '}
                    ·{' '}
                    <Link href={`mailto:${EMAIL_SUPPORT}`}>{EMAIL_SUPPORT}</Link>
                  </Typography>
                </Stack>
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
