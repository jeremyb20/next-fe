import { Theme } from '@mui/material/styles';
import { LoadingButtonProps } from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export function loadingButton(_theme: Theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: LoadingButtonProps }) => ({
          ...(ownerState.variant === 'soft' && {
            // Usar los nombres de clase estándar de MUI
            '& .MuiLoadingButton-loadingIndicator': {
              // Estilos generales si los necesitas
            },
            '& .MuiLoadingButton-loadingIndicatorStart': {
              left: 10,
            },
            '& .MuiLoadingButton-loadingIndicatorEnd': {
              right: 14,
            },
            ...(ownerState.size === 'small' && {
              '& .MuiLoadingButton-loadingIndicatorStart': {
                left: 10,
              },
              '& .MuiLoadingButton-loadingIndicatorEnd': {
                right: 10,
              },
            }),
          }),
        }),
      },
    },
  };
}
