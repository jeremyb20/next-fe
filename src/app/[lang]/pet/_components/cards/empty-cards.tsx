import Iconify from '@/src/components/iconify';

import { Box, Card, Button, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

export function EmptyState({
  message = 'No pets found',
  showAddButton = false,
  onAddClick,
  addButtonText = 'Add Pet',
}: EmptyStateProps) {
  return (
    <Card sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
      {showAddButton && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please add a new pet to get started.
        </Typography>
      )}
      {showAddButton && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={onAddClick}>
            <Iconify icon="eva:plus-fill" sx={{ mr: 1 }} />
            {addButtonText}
          </Button>
        </Box>
      )}
    </Card>
  );
}
