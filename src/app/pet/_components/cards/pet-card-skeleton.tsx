import { Box, Card, Skeleton, CardContent } from '@mui/material';

interface PetCardSkeletonProps {
  count?: number;
}

export function PetCardSkeleton({ count = 2 }: PetCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          sx={{
            flex: 1,
            borderRadius: 4,
            bgcolor: 'background.neutral',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Skeleton variant="circular" width={80} height={80} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="80%" height={24} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
