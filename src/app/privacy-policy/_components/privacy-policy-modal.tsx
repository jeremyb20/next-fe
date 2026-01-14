import React, { useState } from 'react';
import Iconify from '@/src/components/iconify';
import { APP_NAME, EMAIL_SUPPORT } from '@/src/config-global';

import {
  Box,
  Dialog,
  Button,
  Checkbox,
  useTheme,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  FormControlLabel,
} from '@mui/material';

import PrivacyPolicy from './privacy-policy-view';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  requireAcceptance?: boolean;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  open,
  onClose,
  onAccept,
  requireAcceptance = false,
}) => {
  const [accepted, setAccepted] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
    setAccepted(false);
  };

  const handleClose = () => {
    setAccepted(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="div" fontWeight="bold">
            POLÍTICA DE PRIVACIDAD
          </Typography>
          <IconButton onClick={handleClose} size="large">
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {APP_NAME}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
          <PrivacyPolicy />

          <Box
            sx={{
              mt: 4,
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" paragraph>
              <strong>Ejercicio de derechos:</strong> Para ejercer sus derechos
              de acceso, rectificación, cancelación y oposición (ARCO) respecto
              a sus datos personales, puede contactarnos en {EMAIL_SUPPORT}.
            </Typography>
            <Typography variant="body2">
              <strong>Actualizaciones:</strong> {APP_NAME} se reserva el derecho
              de modificar esta Política de Privacidad en cualquier momento. Las
              modificaciones serán efectivas al ser publicadas en este sitio
              web.
            </Typography>
          </Box>
        </Box>

        {requireAcceptance && (
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  He leído y acepto la Política de Privacidad. Entiendo cómo se
                  tratarán mis datos personales.
                </Typography>
              }
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cerrar
        </Button>
        {requireAcceptance && (
          <Button
            onClick={handleAccept}
            variant="contained"
            color="primary"
            disabled={!accepted}
          >
            Aceptar Política de Privacidad
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
