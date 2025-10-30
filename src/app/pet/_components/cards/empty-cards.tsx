import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No pets found' }: EmptyStateProps) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
