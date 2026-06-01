import { Badge, Theme, Avatar, SxProps } from '@mui/material';

// components/PetAvatarWithBadge.tsx
import { IPetProfile } from '@/types/api';

import Iconify from '../iconify';

interface PetAvatarWithBadgeProps {
  pet: IPetProfile;
  size?: number;
  avatarSx?: SxProps<Theme>;
  badgeSx?: SxProps<Theme>;
  onClick?: () => void;
  allowOpacity?: boolean;
}

export const PetAvatarWithBadge = ({
  pet,
  size = 60,
  avatarSx,
  badgeSx,
  onClick,
  allowOpacity = true,
}: PetAvatarWithBadgeProps) => {
  // Determinar configuración según estado
  const getBadgeConfig = () => {
    switch (pet.petStatus) {
      case 'deceased':
        return {
          variant: 'standard' as const,
          color: 'default' as const,
          badgeContent: (
            <Iconify
              icon="entypo:awareness-ribbon"
              width={25}
              sx={{
                position: 'absolute',
                bottom: -10,
                right: -9,
                color: 'error.main',
                bgcolor: 'background.paper',
                borderRadius: '50%',
                p: '2px',
                fontSize: '1rem',
                border: '2px solid white',
              }}
            />
          ),
          avatarOpacity: allowOpacity ? 0.7 : 1,
          avatarFilter: 'grayscale(0.3)',
        };

      case 'lost':
        return {
          variant: 'standard' as const,
          color: 'error' as const,
          badgeContent: (
            <Iconify
              icon="mdi:paw"
              width={22}
              sx={{
                position: 'absolute',
                bottom: -10,
                right: -9,
                color: 'white',
                bgcolor: 'error.main',
                borderRadius: '50%',
                p: '3px',
                fontSize: '1rem',
                border: '2px solid white',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                    opacity: 0.8,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          ),
          avatarOpacity: allowOpacity ? 0.9 : 1,
          avatarFilter: 'brightness(1.05) contrast(1.1)',
        };

      case 'active':
        return {
          variant: 'dot' as const,
          color: 'success' as const,
          badgeContent: undefined,
          avatarOpacity: 1,
          avatarFilter: 'none',
        };

      case 'adopted':
        return {
          variant: 'standard' as const,
          color: 'info' as const,
          badgeContent: (
            <Iconify
              icon="mdi:home-heart"
              width={20}
              sx={{ fontSize: '1rem' }}
            />
          ),
          avatarOpacity: 1,
          avatarFilter: 'none',
        };

      default:
        return {
          variant: 'dot' as const,
          color: 'default' as const,
          badgeContent: undefined,
          avatarOpacity: 1,
          avatarFilter: 'none',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant={config.variant}
      color={config.color}
      badgeContent={config.badgeContent}
      sx={{
        '& .MuiBadge-badge': {
          border: '2px solid white',
          ...(pet.petStatus === 'deceased' && {
            bgcolor: 'transparent',
            p: 0,
            minWidth: 'auto',
            height: 'auto',
          }),
          ...(pet.petStatus === 'lost' && {
            bgcolor: 'transparent',
            p: 0,
            minWidth: 'auto',
            height: 'auto',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.15)',
              },
            },
          }),
        },
        ...badgeSx,
      }}
    >
      <Avatar
        src={pet.photo}
        onClick={onClick}
        alt={pet.petName}
        sx={{
          width: size,
          height: size,
          border: '3px solid',
          borderColor: pet.petStatus === 'lost' ? 'error.main' : 'primary.main',
          opacity: config.avatarOpacity,
          filter: config.avatarFilter,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': onClick
            ? {
                transform: 'scale(1.05)',
                borderColor: 'secondary.main',
              }
            : {},
          ...avatarSx,
        }}
      >
        {pet.petName?.charAt(0).toUpperCase()}
      </Avatar>
    </Badge>
  );
};
