import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Accordion,
  Container,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
const FaqsList = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const faqs = [
    {
      id: 1,
      heading: 'What Are Smart Pet Tags?',
      detail:
        'Smart Tags are permanent identification devices for pets that use QR technology. Each tag has a unique code linked to an online profile where you can store vital information about your pet: contact information, medical history, allergies, vaccinations, and more. This allows anyone who finds your pet to contact you quickly by scanning the QR code with their smartphone.',
    },
    {
      id: 2,
      heading: 'How are pet tags installed?',
      detail:
        'Our tags come with different attachment systems depending on the type of collar. We offer tags for collars with rings, tags with a quick-release system, and tags for harnesses. Installation is simple and does not require any special tools. We include detailed instructions with every order and tutorial videos on our website.',
    },
    {
      id: 3,
      heading: 'What information can I include in my pets profile?',
      detail:
        'You can include: the owners contact information (multiple phone numbers), the pets name, recent photos, breed, age, weight, medical information (chronic conditions, allergies, medications), veterinarians information, emergency contacts, special instructions, and even a reward offered if the pet goes missing. You can edit this information at any time from your account.',
    },
    {
      id: 4,
      heading: 'What happens if my pet gets lost?',
      detail:
        'If your pet goes missing: 1) Immediately update the status on its profile to “Missing,” 2) Youll receive notifications when someone scans the QR code, 3) Well help you create digital posters to share on social media, 5) Well stay in direct contact with you throughout the search process.',
    },
    {
      id: 5,
      heading: 'Does it work without an internet connection?',
      detail:
        'The QR code works even without an internet connection. When you scan it, a page opens with basic contact information. If the device has an internet connection, it will display the pet’s complete profile with all the details. We also include a phone number engraved on the tag for those who are unable to scan the QR code.',
    },
    {
      id: 6,
      heading: 'Is my pets information secure?',
      detail:
        'Yes, security is our top priority. We use end-to-end encryption, secure servers in Costa Rica, and comply with Data Protection Law 8968. Only you have full access to your pet’s profile. Basic contact information is visible to anyone who scans the code, but sensitive medical information requires your prior authorization.',
    },
    // {
    //   id: 7,
    //   heading: '¿Cuánto dura la suscripción? ¿Hay renovación?',
    //   detail:
    //     'Ofrecemos diferentes planes: Plaquita Básica (sin suscripción - solo código QR grabado), Plaquita Inteligente (suscripción anual que incluye perfil online editable), y Plan Familiar (múltiples mascotas con descuento). Las renovaciones son automáticas con notificación previa. Puedes cancelar en cualquier momento desde tu cuenta.',
    // },
    {
      id: 8,
      heading: 'Do you ship nationwide? How long does it take?',
      detail:
        'Yes, we ship to all 7 provinces in Costa Rica. Within the Greater San José Metropolitan Area (GAM): 1–2 business days. Outside the GAM: 2–3 business days. For urgent shipments, we offer express service (same-day delivery within the GAM). Shipping costs vary by region and are calculated at checkout. You can also pick up your order at our distribution center in San José.',
    },
    {
      id: 9,
      heading: 'What happens if the pet tag gets damaged or lost?',
      detail:
        'We offer a 1-year warranty against manufacturing defects. If the tag is damaged within this period, we will replace it at no cost. If you lose the tag, we can issue a new one with the same QR code and profile. There is a small replacement fee that varies depending on the type of tag and your plan.',
    },
    {
      id: 10,
      heading: 'Can I register more than one pet?',
      detail:
        'Of course! We offer discounted family plans for multiple pets. You can manage all their profiles from a single account. Each pet will have its own tag with a unique QR code.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        {/* <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Preguntas Frecuentes
        </Typography> */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
        >
          {t(
            'Find answers to the most common questions about our Smart Plates'
          )}
        </Typography>
      </Box>

      {/* FAQ Accordions */}
      <Box sx={{ mb: 8 }}>
        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            elevation={1}
            sx={{
              mb: 2,
              borderRadius: '8px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-downward-fill" />}
              sx={{
                backgroundColor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {t(faq.heading)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {t(faq.detail)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FaqsList;
