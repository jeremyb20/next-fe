import React, { useState } from 'react';
import Iconify from '@/src/components/iconify';

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

import TermsAndConditions from './terms-and-conditions-view';

interface TermsAndConditionsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  open,
  onClose,
  onAccept,
}) => {
  const [accepted, setAccepted] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccept = () => {
    onAccept();
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
            TÉRMINOS Y CONDICIONES
          </Typography>
          <IconButton onClick={handleClose} size="large">
            <Iconify icon="mdi:close" />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          Plaquitas para mascotas CR
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <TermsAndConditions />

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
                He leído y acepto los términos y condiciones anteriores.
                Confirmo que soy mayor de 18 años.
              </Typography>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          disabled={!accepted}
        >
          Aceptar Términos y Condiciones
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
