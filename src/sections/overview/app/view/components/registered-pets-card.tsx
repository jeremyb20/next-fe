// components/dashboard/user/registered-pets-card.tsx
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { BreedOptions } from '@/utils/constants';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Card,
  Chip,
  Avatar,
  Typography,
  CardContent,
} from '@mui/material';

interface RegisteredPetsCardProps {
  pets: IPetProfile[];
  onViewAll?: () => void;
  onPetClick?: (pet: IPetProfile) => void;
}

export function RegisteredPetsCard({
  pets,
  onViewAll,
  onPetClick,
}: RegisteredPetsCardProps) {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 4, mb: 3, bgcolor: 'background.paper' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {t('Registered Pets')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', cursor: 'pointer' }}
            onClick={onViewAll}
          >
            {t('View all')}
          </Typography>
        </Box>

        {pets.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            {t('No registered pets yet')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pets.slice(0, 3).map((pet) => (
              <Box
                key={pet._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover', borderRadius: 2 },
                  p: 1,
                }}
                onClick={() => onPetClick?.(pet)}
              >
                <Avatar
                  src={pet.photo}
                  sx={{ width: 48, height: 48, borderRadius: 2 }}
                >
                  {pet.petName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {pet.petName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={
                        BreedOptions.todos.find(
                          (breed) => breed.value === pet?.breed
                        )?.label || 'Unknown breed'
                      }
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={`${pet.birthDate} ${t('years')}`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  sx={{ color: 'text.secondary' }}
                />
              </Box>
            ))}
            {pets.length > 3 && (
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textAlign: 'center',
                  mt: 1,
                }}
                onClick={onViewAll}
              >
                {t('+{{count}} more', { count: pets.length - 3 })}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
