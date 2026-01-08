import React from 'react';
import Iconify from '@/src/components/iconify';

import {
  Box,
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface AvatarOption {
  avatarDialog: {
    value: boolean;
    onFalse: () => void;
    onTrue: () => void;
  };
  user: {
    avatarProfile: string;
  };
  avatars: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  handleSelectAvatar: (src: string) => void;
}

export default function AccountSelectionModal({
  avatarDialog,
  user,
  avatars,
  handleSelectAvatar,
}: AvatarOption) {
  return (
    <Dialog
      open={avatarDialog.value}
      onClose={avatarDialog.onFalse}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:account-circle" width={24} />
          <span>Choose Your Avatar</span>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Click on an avatar to select it. The selected avatar will be
            highlighted with a blue border.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {avatars.map((avatar) => (
            <Grid xs={3} sm={2} key={avatar.id}>
              <Card
                onClick={() => handleSelectAvatar(avatar.id.toString())}
                sx={{
                  cursor: 'pointer',
                  p: 1,
                  border: (theme) =>
                    user?.avatarProfile === avatar.src
                      ? `2px solid ${theme.palette.primary.main}`
                      : '1px solid transparent',
                  borderRadius: '50%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    paddingTop: '100%',
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Current Avatar Preview */}
        {user?.avatarProfile && (
          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Avatar:
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: 2,
                  borderColor: 'primary.main',
                }}
              >
                <img
                  src={`/assets/images/avatars/avatar-${user.avatarProfile}.webp`}
                  alt="Current avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your current profile picture
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={avatarDialog.onFalse}
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="mdi:close" />}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            // Si quieres mantener la selección actual
            avatarDialog.onFalse();
          }}
          variant="contained"
          startIcon={<Iconify icon="mdi:check" />}
        >
          Keep Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
}
