// components/share/share-drawer-dialog.tsx

'use client';

import React from 'react';
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import ShareButtons from '@/app/[lang]/pet/_components/share/share-buttons';

import {
  Box,
  Theme,
  Dialog,
  SxProps,
  useTheme,
  IconButton,
  useMediaQuery,
  SwipeableDrawer,
} from '@mui/material';

interface ShareDrawerDialogProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareDescription: string;
  petProfile: IPetProfile;
  useDrawer?: boolean; // Forzar uso de drawer en lugar de dialog
  dialogMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  dialogPaperProps?: {
    sx?: SxProps<Theme>;
  };
  drawerAnchor?: 'bottom' | 'left' | 'right' | 'top';
  drawerPaperProps?: {
    sx?: SxProps<Theme>;
  };
  showDragHandle?: boolean;
  onShareSuccess?: (platform: string) => void;
  onShareError?: (platform: string, error: Error) => void;
}

export default function ShareDrawerDialog({
  open,
  onClose,
  shareUrl,
  shareTitle,
  shareDescription,
  petProfile,
  useDrawer,
  dialogMaxWidth = 'sm',
  dialogPaperProps = {
    sx: {
      borderRadius: 2,
    },
  },
  drawerAnchor = 'bottom',
  drawerPaperProps = {
    sx: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '80vh',
    },
  },
  showDragHandle = true,
  onShareSuccess,
  onShareError,
}: ShareDrawerDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Determinar si usar drawer basado en props o en el tamaño de pantalla
  const shouldUseDrawer = useDrawer !== undefined ? useDrawer : isMobile;

  // Renderizar el contenido compartido
  const renderShareContent = () => (
    <ShareButtons
      shareUrl={shareUrl}
      shareTitle={shareTitle}
      shareDescription={shareDescription}
      petProfile={petProfile}
      isMobile={shouldUseDrawer}
      onClose={onClose}
    />
  );

  // Renderizar el drag handle para drawer
  const renderDragHandle = () => (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        py: 1,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 4,
          backgroundColor: 'grey.300',
          borderRadius: 2,
        }}
      />
    </Box>
  );

  if (shouldUseDrawer) {
    return (
      <SwipeableDrawer
        anchor={drawerAnchor}
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        PaperProps={drawerPaperProps}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: drawerAnchor === 'bottom' ? 16 : 0,
            borderTopRightRadius: drawerAnchor === 'bottom' ? 16 : 0,
          },
        }}
      >
        {showDragHandle && renderDragHandle()}
        {renderShareContent()}
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={dialogMaxWidth}
      fullWidth
      PaperProps={dialogPaperProps}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
        {renderShareContent()}
      </Box>
    </Dialog>
  );
}
