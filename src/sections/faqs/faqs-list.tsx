import React from 'react';
import Iconify from '@/src/components/iconify';

import {
  Box,
  useTheme,
  Accordion,
  Container,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

const FaqsList = () => {
  const theme = useTheme();

  const faqs = [
    {
      id: 1,
      heading: '¿Qué son las Plaquitas Inteligentes?',
      detail:
        'Las Plaquitas Inteligentes son dispositivos de identificación permanente para mascotas que utilizan tecnología QR. Cada placa tiene un código único vinculado a un perfil en línea donde puedes almacenar información vital de tu mascota: datos de contacto, historial médico, alergias, vacunas y más. Esto permite que cualquier persona que encuentre a tu mascota pueda contactarte rápidamente escaneando el código QR con su smartphone.',
    },
    {
      id: 2,
      heading: '¿Cómo se instalan las placas?',
      detail:
        'Nuestras placas vienen con diferentes sistemas de sujeción según el tipo de collar. Ofrecemos placas para collar con argolla, placas con sistema de enganche rápido, y placas para arnés. La instalación es sencilla y no requiere herramientas especiales. Incluimos instrucciones detalladas con cada pedido y videos tutoriales en nuestro sitio web.',
    },
    {
      id: 3,
      heading: '¿Qué información puedo incluir en el perfil de mi mascota?',
      detail:
        'Puedes incluir: datos de contacto del dueño (múltiples teléfonos), nombre de la mascota, fotos recientes, raza, edad, peso, información médica (enfermedades crónicas, alergias, medicamentos), datos del veterinario, contactos de emergencia, instrucciones especiales, y hasta recompensa ofrecida en caso de extravío. La información es editable en cualquier momento desde tu cuenta.',
    },
    {
      id: 4,
      heading: '¿Qué pasa si mi mascota se pierde?',
      detail:
        'Si tu mascota se pierde: 1) Actualiza inmediatamente el estado en su perfil a "Perdida", 2) Recibirás notificaciones cuando alguien escanee el código QR, 3) Nuestro sistema generará alertas en tu zona, 4) Te ayudaremos a crear carteles digitales para compartir en redes sociales, 5) Mantendremos comunicación directa contigo durante el proceso de búsqueda.',
    },
    {
      id: 5,
      heading: '¿Funciona sin conexión a internet?',
      detail:
        'El código QR funciona incluso sin conexión a internet. Al escanearlo, se abre una página con información básica de contacto. Si el dispositivo tiene internet, mostrará el perfil completo de la mascota con todos los datos. También incluimos un número de teléfono grabado en la placa para aquellos que no puedan escanear el código QR.',
    },
    {
      id: 6,
      heading: '¿Es segura la información de mi mascota?',
      detail:
        'Sí, la seguridad es nuestra prioridad. Utilizamos encriptación de extremo a extremo, servidores seguros en Costa Rica, y cumplimos con la Ley 8968 de Protección de Datos. Solo tú tienes acceso completo al perfil de tu mascota. La información de contacto básica es visible para quienes escanean el código, pero datos médicos sensibles requieren tu autorización previa.',
    },
    {
      id: 7,
      heading: '¿Cuánto dura la suscripción? ¿Hay renovación?',
      detail:
        'Ofrecemos diferentes planes: Plaquita Básica (sin suscripción - solo código QR grabado), Plaquita Inteligente (suscripción anual que incluye perfil online editable), y Plan Familiar (múltiples mascotas con descuento). Las renovaciones son automáticas con notificación previa. Puedes cancelar en cualquier momento desde tu cuenta.',
    },
    {
      id: 8,
      heading: '¿Hacen envíos a todo el país? ¿Cuánto tardan?',
      detail:
        'Sí, hacemos envíos a las 7 provincias de Costa Rica. En el GAM: 1-2 días hábiles. Fuera del GAM: 2-3 días hábiles. Para envíos urgentes contamos con servicio express (mismo día en GAM). Los costos de envío varían según la zona y se calculan al momento de la compra. También puedes recoger en nuestro centro de distribución en San José.',
    },
    {
      id: 9,
      heading: '¿Qué pasa si la placa se daña o pierde?',
      detail:
        'Ofrecemos garantía de 1 año por defectos de fabricación. Si la placa se daña dentro de este período, la reemplazamos sin costo. Si pierdes la placa, podemos emitir una nueva manteniendo el mismo código QR y perfil. Existe un costo reducido por reemplazo que varía según el tipo de placa y plan contratado.',
    },
    {
      id: 10,
      heading: '¿Puedo registrar más de una mascota?',
      detail:
        '¡Claro! Ofrecemos planes familiares con descuento para múltiples mascotas. Puedes gestionar todos los perfiles desde una sola cuenta. Cada mascota tendrá su placa con código QR único. También ofrecemos paquetes especiales para protectoras de animales y veterinarias con necesidades de múltiples registros.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
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
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
        >
          Encuentra respuestas a las preguntas más comunes sobre nuestras
          Plaquitas Inteligentes
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
                {faq.heading}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {faq.detail}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FaqsList;
