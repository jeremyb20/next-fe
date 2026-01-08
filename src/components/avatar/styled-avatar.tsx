import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface StyledAvatarProps {
  src?: string | null;
  alt?: string;
  onClick?: () => void;
  disabled?: boolean;
  sx?: any;
  skeleton?: boolean;
}

export default function StyledAvatar({
  src,
  alt = 'avatar',
  onClick,
  disabled = false,
  sx,
  skeleton = false,
}: StyledAvatarProps) {
  const hasFile = !!src;

  const renderPreview = hasFile && (
    <Image
      alt={alt}
      src={src}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
      }}
    />
  );

  const renderSkeleton = skeleton && (
    <Box
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '50%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />
      <Typography variant="caption">
        {hasFile ? 'Update photo' : 'Upload photo'}
      </Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        p: 1,
        m: 'auto',
        width: 144,
        height: 144,
        cursor: disabled ? 'default' : 'pointer',
        overflow: 'hidden',
        borderRadius: '50%',
        border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasFile && {
          '&:hover .upload-placeholder': {
            opacity: 1,
          },
        }),
        ...sx,
      }}
    >
      {skeleton ? renderSkeleton : renderContent}
    </Box>
  );
}
