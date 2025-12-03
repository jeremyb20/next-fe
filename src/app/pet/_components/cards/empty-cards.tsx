import { Box, Button, Typography } from '@mui/material';

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
    <Box sx={{ flex: 1, textAlign: 'center', py: 4 }}>
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
          <Button onClick={onAddClick}>{addButtonText}</Button>
        </Box>
      )}
    </Box>
  );
}
