'use client';

import type { IScannerControls } from '@zxing/browser';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRef, useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onResultAction: (value: string) => void;
};

export default function QrScannerDialog({ open, onCloseAction, onResultAction }: Props) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const onResultRef = useRef(onResultAction);

  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    onResultRef.current = onResultAction;
  }, [onResultAction]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setErrorKey(null);

    const startScanner = async () => {
      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const reader = new BrowserQRCodeReader();

        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current ?? undefined,
          (result) => {
            if (!result) return;
            controlsRef.current?.stop();
            onResultRef.current(result.getText());
          }
        );

        if (cancelled) {
          controls.stop();
        } else {
          controlsRef.current = controls;
        }
      } catch (error: any) {
        if (cancelled) return;

        setErrorKey(
          error?.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permissions and try again.'
            : 'Unable to start the camera. Please try again.'
        );
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onCloseAction} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {t('Scan QR code')}
        <IconButton onClick={onCloseAction} aria-label={t('Close')}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {errorKey ? (
            <Alert severity="error">{t(errorKey)}</Alert>
          ) : (
            <Box
              sx={{
                position: 'relative',
                bgcolor: 'common.black',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '1 / 1',
              }}
            >
              <Box
                component="video"
                ref={videoRef}
                muted
                playsInline
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: '12%',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'common.white',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
                }}
              />
            </Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {t('Point your camera at the QR code')}
          </Typography>

          <Button variant="outlined" color="inherit" onClick={onCloseAction} fullWidth>
            {t('Close')}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
