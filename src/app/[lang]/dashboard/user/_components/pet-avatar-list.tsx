import { alpha } from '@mui/material/styles';
import {
  Box,
  Badge,
  Avatar,
  Tooltip,
  Skeleton,
  Typography,
} from '@mui/material';

// components/pets/pet-avatar-list.tsx
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { ALLOW_MAX_PETS_BY_USER } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';

interface PetAvatarListProps {
  pets: IPetProfile[];
  selectedPetId?: string;
  onSelectPet: (pet: IPetProfile) => void;
  onAddMore?: () => void;
  maxPets?: number;
  isFetching?: boolean;
}

export function PetAvatarList({
  pets,
  selectedPetId,
  onSelectPet,
  onAddMore,
  maxPets = Number(ALLOW_MAX_PETS_BY_USER),
  isFetching,
}: PetAvatarListProps) {
  const showAddButton = pets.length < maxPets;
  const { t } = useTranslation();

  // Función para determinar la variante del Badge según el estado
  const getBadgeVariant = (pet: IPetProfile): 'dot' | 'standard' => {
    if (pet.petStatus === 'deceased' || pet.petStatus === 'lost') {
      return 'standard';
    }
    return 'dot';
  };

  // Función para determinar el color del Badge según el estado
  const getBadgeColor = (
    pet: IPetProfile
  ): 'success' | 'default' | 'error' | 'warning' => {
    switch (pet.petStatus) {
      case 'active':
        return 'success';
      case 'lost':
        return 'error';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Función para determinar el contenido del Badge según el estado de la mascota
  const getBadgeContent = (pet: IPetProfile) => {
    if (pet.petStatus === 'deceased') {
      return (
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
      );
    }

    if (pet.petStatus === 'lost') {
      return (
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
      );
    }

    if (pet.petStatus === 'inactive') {
      return (
        <Iconify
          icon="mdi:sleep"
          width={20}
          sx={{
            position: 'absolute',
            bottom: -10,
            right: -9,
            color: 'white',
            bgcolor: 'warning.main',
            borderRadius: '50%',
            p: '2px',
            fontSize: '0.875rem',
            border: '2px solid white',
          }}
        />
      );
    }

    return undefined; // Para el Badge con variant="dot"
  };

  // Función para obtener el tooltip según el estado
  const getTooltipTitle = (pet: IPetProfile): string => {
    const statusMessages: Record<string, string> = {
      active: pet.petName,
      inactive: `${pet.petName} (Inactivo)`,
      lost: `🚨 ${pet.petName} (EXTRAVIADO)`,
      deceased: `🕊️ ${pet.petName} (En memoria)`,
    };
    return statusMessages[pet.petStatus] || pet.petName;
  };

  // Función para obtener el estilo del avatar según el estado
  const getAvatarStyles = (pet: IPetProfile) => {
    const baseStyles = {
      opacity: 1,
      filter: 'none',
    };

    switch (pet.petStatus) {
      case 'deceased':
        return {
          opacity: 0.7,
          filter: 'grayscale(0.3)',
        };
      case 'lost':
        return {
          opacity: 0.9,
          filter: 'brightness(1.05) contrast(1.1)',
          animation: 'pulse-border 1.5s ease-in-out infinite',
          '@keyframes pulse-border': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)',
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(211, 47, 47, 0)',
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)',
            },
          },
        };
      default:
        return baseStyles;
    }
  };

  if (isFetching) {
    // Mostrar la cantidad de skeletons basada en maxPets (máximo 5)
    const skeletonCount = Math.min(maxPets, 5);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          py: 1,
          px: 2,
        }}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <Skeleton
              variant="circular"
              width={70}
              height={70}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.2),
              }}
            />
            <Skeleton
              variant="text"
              width={50}
              height={16}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.2),
              }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        py: 1,
        px: 2,
        // Estilos para el scrollbar
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: (theme) => alpha(theme.palette.grey[500], 0.1),
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => alpha(theme.palette.grey[500], 0.3),
          borderRadius: '10px',
          '&:hover': {
            background: (theme) => alpha(theme.palette.grey[500], 0.5),
          },
        },
        // Soporte para Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: (theme) =>
          `${alpha(theme.palette.grey[500], 0.3)} ${alpha(
            theme.palette.grey[500],
            0.1
          )}`,
      }}
    >
      {/* Lista de mascotas */}
      {pets.map((pet) => (
        <Tooltip
          key={pet._id}
          title={getTooltipTitle(pet)}
          placement="top"
          arrow
        >
          <Box
            onClick={() => onSelectPet(pet)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: selectedPetId === pet._id ? 1 : 0.7,
              transform: selectedPetId === pet._id ? 'scale(1.05)' : 'scale(1)',
              flexShrink: 0,
              '&:hover': {
                opacity: 1,
                transform: 'scale(1.05)',
              },
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={getBadgeVariant(pet)}
              color={getBadgeColor(pet)}
              badgeContent={getBadgeContent(pet)}
              sx={{
                '& .MuiBadge-badge': {
                  border: '2px solid white',
                  ...((pet.petStatus === 'deceased' ||
                    pet.petStatus === 'lost') && {
                    bgcolor: 'transparent',
                    p: 0,
                    minWidth: 'auto',
                    height: 'auto',
                  }),
                  ...(pet.petStatus === 'lost' && {
                    animation: 'pulse-badge 1.5s ease-in-out infinite',
                    '@keyframes pulse-badge': {
                      '0%': {
                        transform: 'scale(1)',
                      },
                      '50%': {
                        transform: 'scale(1.15)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                      },
                    },
                  }),
                },
              }}
            >
              <Avatar
                src={pet.photo}
                sx={{
                  width: 70,
                  height: 70,
                  border:
                    selectedPetId === pet._id
                      ? pet.petStatus === 'lost'
                        ? '3px solid'
                        : '3px solid'
                      : '2px solid',
                  borderColor:
                    selectedPetId === pet._id
                      ? pet.petStatus === 'lost'
                        ? 'error.main'
                        : 'primary.main'
                      : 'transparent',
                  boxShadow: selectedPetId === pet._id ? 2 : 0,
                  bgcolor: 'primary.lighter',
                  ...getAvatarStyles(pet),
                }}
              >
                {pet.petName?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Typography
              variant="caption"
              fontWeight={selectedPetId === pet._id ? 600 : 400}
              sx={{
                color:
                  selectedPetId === pet._id
                    ? pet.petStatus === 'lost'
                      ? 'error.main'
                      : 'primary.main'
                    : pet.petStatus === 'lost'
                      ? 'error.dark'
                      : 'text.secondary',
                textDecoration:
                  pet.petStatus === 'deceased' ? 'line-through' : 'none',
                fontWeight: pet.petStatus === 'lost' ? 600 : 'normal',
              }}
            >
              {pet.petName.length > 10
                ? `${pet.petName.substring(0, 8)}...`
                : pet.petName}
            </Typography>
          </Box>
        </Tooltip>
      ))}

      {/* Botón para agregar nueva mascota */}
      {showAddButton && onAddMore && (
        <Tooltip title={t('Add pet')} placement="top">
          <Box
            onClick={onAddMore}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                border: '2px dashed',
                borderColor: 'primary.main',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <Iconify
                icon="eva:plus-fill"
                width={32}
                color={(theme) => theme.palette.primary.main}
              />
            </Avatar>
            <Typography variant="caption" color="primary.main" fontWeight={500}>
              {t('Add pet')}
            </Typography>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
