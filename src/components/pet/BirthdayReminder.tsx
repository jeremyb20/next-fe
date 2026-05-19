// components/BirthdayReminder.tsx
import { useTranslation } from '@/hooks/use-translation';
import { formatDate, getDaysUntilNextBirthday } from '@/utils/format-time';

import {
  Box,
  Paper,
  Alert,
  Avatar,
  Typography,
  AlertTitle,
} from '@mui/material';

import Iconify from '../iconify';
import { PetAvatarWithBadge } from '../badge/PetAvatarWithBage';

interface BirthdayReminderProps {
  birthDate: string;
  petName: string;
  variant?: 'alert' | 'card' | 'banner';
  showAlways?: boolean;
  onClose?: () => void;
  photo?: string;
  petId?: string; // Añadido para el badge,
  petStatus?: string;
  showPetNameTitle?: boolean;
}

export const BirthdayReminder = ({
  birthDate,
  petName,
  photo,
  petId,
  variant = 'alert',
  showAlways = false,
  showPetNameTitle = false,
  petStatus,
  onClose,
}: BirthdayReminderProps) => {
  const { t } = useTranslation();

  if (!birthDate) return null;

  const daysUntilBirthday = getDaysUntilNextBirthday(birthDate);
  const isBirthdayToday = daysUntilBirthday === 0;
  const isBirthdayTomorrow = daysUntilBirthday === 1;
  const isBirthdayThisWeek = daysUntilBirthday > 1 && daysUntilBirthday <= 7;
  const isBirthdayThisMonth = daysUntilBirthday > 7 && daysUntilBirthday <= 30;

  // Si no quieres mostrar el recordatorio cuando falta mucho tiempo
  if (
    !showAlways &&
    !isBirthdayToday &&
    !isBirthdayTomorrow &&
    !isBirthdayThisWeek &&
    !isBirthdayThisMonth
  ) {
    return null;
  }

  let severity: 'error' | 'warning' | 'info' | 'success' = 'info';
  let message = '';
  let detail = '';
  let icon = 'tabler:cake';

  if (isBirthdayToday) {
    severity = 'error';
    icon = 'tabler:confetti';
    message = t("🎉 It's {{name}}'s birthday today!", { name: petName });
    detail = t("Don't forget to celebrate! 🎂");
  } else if (isBirthdayTomorrow) {
    severity = 'warning';
    message = t('Birthday Reminder');
    detail = t("Tomorrow is {{name}}'s birthday! 🎈", { name: petName });
  } else if (isBirthdayThisWeek) {
    severity = 'warning';
    message = t('Birthday Reminder');
    detail = t('In {{days}} days - {{date}}', {
      days: daysUntilBirthday,
      date: formatDate(birthDate),
    });
  } else if (isBirthdayThisMonth) {
    severity = 'info';
    message = showPetNameTitle ? petName : t('Upcoming Birthday');
    detail = t('In {{days}} days - {{date}}', {
      days: daysUntilBirthday,
      date: formatDate(birthDate),
    });
  } else {
    message = t('Birthday');
    detail = t('Birthday: {{date}}', {
      date: formatDate(birthDate),
    });
  }

  const getBannerBorderColor = () => {
    if (severity === 'error') return '#d32f2f';
    if (severity === 'warning') return '#ed6c02';
    if (severity === 'info') return '#0288d1';
    return '#9e9e9e';
  };

  const getBannerBgColor = () => {
    if (severity === 'error') return '#ffebee';
    if (severity === 'warning') return '#fff4e5';
    if (severity === 'info') return '#e3f2fd';
    return '#f5f5f5';
  };

  // Variant: Alert
  if (variant === 'alert') {
    return (
      <Alert
        severity={severity}
        icon={photo ? false : <Iconify icon={icon} />}
        action={
          onClose &&
          showPetNameTitle && (
            <Iconify icon="gridicons:external" onClick={onClose} />
          )
        }
        sx={{
          borderLeft: `4px solid ${getBannerBorderColor()}`,
          '& .MuiAlert-icon': { fontSize: '1.5rem' },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {photo && (
            <Box sx={{ flexShrink: 0 }}>
              <PetAvatarWithBadge
                pet={
                  { _id: petId, petName, photo, birthDate, petStatus } as any
                }
                size={50}
              />
            </Box>
          )}
          <Box flex={1}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>{message}</AlertTitle>
            {detail}
          </Box>
        </Box>
      </Alert>
    );
  }

  // Variant: Card
  if (variant === 'card') {
    const getCardColors = () => {
      switch (severity) {
        case 'error':
          return { borderColor: '#d32f2f', bgcolor: 'error.lighter' };
        case 'warning':
          return { borderColor: '#ed6c02', bgcolor: 'warning.lighter' };
        case 'info':
          return { borderColor: '#0288d1', bgcolor: 'info.lighter' };
        default:
          return { borderColor: '#9e9e9e', bgcolor: 'background.neutral' };
      }
    };

    const colors = getCardColors();

    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: colors.bgcolor,
          borderTop: `4px solid ${colors.borderColor}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          {photo && (
            <Box sx={{ mb: 2 }}>
              <PetAvatarWithBadge
                pet={
                  { _id: petId, petName, photo, birthDate, petStatus } as any
                }
                size={50}
              />
            </Box>
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={1}
          >
            {!photo && (
              <Iconify
                icon={icon}
                width={32}
                height={32}
                sx={{ color: colors.borderColor, mr: 1 }}
              />
            )}
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {detail}
        </Typography>
        {isBirthdayToday && (
          <Typography
            variant="caption"
            fontStyle="italic"
            display="block"
            color="error.main"
          >
            🎂 {t('Make a wish!')} 🎂
          </Typography>
        )}
        <Box
          component="img"
          src="/assets/images/birthday-cake.png"
          alt="Decorative"
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -12,
            width: 100,
            height: 'auto',
            objectFit: 'contain',
            zIndex: 0,
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />
      </Paper>
    );
  }

  // Variant: Banner
  return (
    <Box
      sx={{
        bgcolor: getBannerBgColor(),
        p: 2,
        borderRadius: 2,
        border: `1px solid ${getBannerBorderColor()}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {photo ? (
        <>
          {petId ? (
            <PetAvatarWithBadge
              pet={{ _id: petId, petName, photo, birthDate } as any}
              size={40}
            />
          ) : (
            <Avatar src={photo} alt={petName} sx={{ width: 40, height: 40 }} />
          )}
          <Box flex={1}>
            <Typography variant="body2" fontWeight="bold">
              {message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {detail}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Iconify icon={icon} width={24} height={24} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {detail}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};
