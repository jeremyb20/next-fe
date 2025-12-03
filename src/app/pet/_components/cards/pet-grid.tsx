import { IPetProfile } from '@/src/types/api';
import Iconify from '@/src/components/iconify';

import { Box, Button } from '@mui/material';

import { PetCard } from './pet-card-list';
import { EmptyState } from './empty-cards';
import { PetCardSkeleton } from './pet-card-skeleton';

interface PetsGridProps {
  isFetching: boolean;
  usersData?: IPetProfile[];
  skeletonCount?: number;
  onPetDelete?: (pet: IPetProfile) => void;
  onPetView?: (pet: IPetProfile) => void;
  onPetEdit?: (pet: IPetProfile) => void;
  emptyMessage?: string;
  showAddMoreButton?: boolean;
  onAddMore?: () => void;
  addMoreButtonText?: string;
}

export function PetsGrid({
  isFetching,
  usersData,
  skeletonCount = 2,
  onPetDelete,
  onPetView,
  onPetEdit,
  emptyMessage = 'No pets found',
  showAddMoreButton,
  onAddMore,
  addMoreButtonText = 'Add More',
}: PetsGridProps) {
  return (
    <Box
      gap={{
        xs: 1,
        sm: 1,
        md: 3,
      }}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {isFetching && <PetCardSkeleton count={skeletonCount} />}

      {usersData && usersData.length > 0 ? (
        <>
          {/* Renderizar todas las cards de mascotas */}
          {usersData.map((pet, index) => (
            <PetCard
              key={pet._id || `pet-${index}`}
              pet={pet}
              index={index}
              onDelete={onPetDelete}
              onView={onPetView}
              onEdit={onPetEdit}
            />
          ))}

          {/* Botón "Agregar más" al final si está habilitado */}
          {showAddMoreButton && onAddMore && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'auto',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 4,
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={onAddMore}
            >
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-fill" />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  flexDirection: 'column',
                  height: '100%',
                  width: '100%',
                  minHeight: 'auto',
                }}
              >
                {addMoreButtonText}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          message={emptyMessage}
          showAddButton={showAddMoreButton}
          onAddClick={onAddMore}
          addButtonText={addMoreButtonText}
        />
      )}
    </Box>
  );
}
