// components/UserProfileCard.tsx

import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';

import {
  Box,
  Card,
  Theme,
  Avatar,
  SxProps,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

interface UserProfileCardProps {
  petCount?: number | string;
  isFetching?: boolean;

  // Props para la imagen decorativa
  decorativeImage?: string;
  decorativeImageSx?: SxProps<Theme>;
  showDecorativeImage?: boolean;

  // Props de estilos
  cardSx?: SxProps<Theme>;
  cardContentSx?: SxProps<Theme>;
  avatarSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;

  // Props de texto
  greetingText?: string;
  petRegisteredText?: string;

  // Eventos
  onAvatarClick?: () => void;
}

export function UserProfileCard({
  petCount,
  isFetching = false,
  decorativeImage = '/assets/images/paw-cat.png',
  decorativeImageSx = {},
  showDecorativeImage = true,
  cardSx = {},
  cardContentSx = {},
  avatarSx = {},
  containerSx = {},
  greetingText = 'Hi there!',
  petRegisteredText = 'Pets Registered',
  onAvatarClick,
}: UserProfileCardProps) {
  const { t } = useTranslation();
  const { user } = useManagerUser();
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 4,
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        ...cardSx,
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, ...cardContentSx }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, ...containerSx }}
        >
          <Avatar
            src={user?.photoURL}
            sx={{
              width: 60,
              height: 60,
              cursor: onAvatarClick ? 'pointer' : 'default',
              ...avatarSx,
            }}
            onClick={onAvatarClick}
          />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {t(greetingText)}, {user?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(petRegisteredText)}:{' '}
              {isFetching ? <CircularProgress size={12} /> : petCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Imagen decorativa */}
      {showDecorativeImage && decorativeImage && (
        <Box
          component="img"
          src={decorativeImage}
          alt="Decorative"
          sx={{
            position: 'absolute',
            top: -3,
            right: -10,
            width: 140,
            height: 'auto',
            objectFit: 'contain',
            zIndex: 0,
            opacity: 0.3,
            pointerEvents: 'none',
            ...decorativeImageSx,
          }}
        />
      )}
    </Card>
  );
}
