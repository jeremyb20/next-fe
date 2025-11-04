import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { StackProps } from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { Theme, alpha, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  title?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function CardComponent({
  title,
  sx,
  children,
  ...other
}: BlockProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        borderStyle: 'dashed',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        position: 'relative', // Necesario para posicionar el título
        pt: title ? 3 : 0, // Espacio para el título
      }}
    >
      {title && (
        <CardHeader
          title={title}
          sx={{
            position: 'absolute',
            top: -12, // Ajusta según necesites
            left: 16,
            borderRadius: 1.5,
            border: `0.1px dashed`,
            borderColor: (theme) => theme.palette.divider,
            color: (theme) => theme.palette.text.secondary,
            backgroundColor: (theme) => theme.palette.background.paper,
            px: 1,
            py: 0,
            '& .MuiCardHeader-title': {
              fontSize: '0.875rem',
              fontWeight: 600,
            },
          }}
        />
      )}

      <Box
        sx={{
          px: 3,
          minHeight: 180,
          ...sx,
        }}
        {...other}
      >
        {children}
      </Box>
    </Paper>
  );
}
