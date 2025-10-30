import { IPetProfile } from '@/src/types/api';

import { Box } from '@mui/material';

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
}

export function PetsGrid({
  isFetching,
  usersData,
  skeletonCount = 2,
  onPetDelete,
  onPetView,
  onPetEdit,
  emptyMessage = 'No pets found',
}: PetsGridProps) {
  if (isFetching) {
    <PetCardSkeleton count={skeletonCount} />;
  }
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
      {usersData && usersData?.length > 0 ? (
        usersData.map((pet, index) => (
          <PetCard
            key={pet._id || `pet-${index}`}
            pet={pet}
            index={index}
            onDelete={onPetDelete}
            onView={onPetView}
            onEdit={onPetEdit}
          />
        ))
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </Box>
  );
}
