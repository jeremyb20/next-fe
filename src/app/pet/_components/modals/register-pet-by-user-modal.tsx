import React from 'react';
import { IUser } from '@/src/types/api';
import Iconify from '@/src/components/iconify';

import { Dialog, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { PetRegistrationUserAuthenticated } from '../forms/pet-registration-user-authenticated';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUser;
  refetch: () => void;
};

export default function RegisterPetByUserModal({
  currentUser,
  open,
  onClose,
  refetch,
}: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
      scroll="paper"
    >
      <DialogTitle>
        Add pet {currentUser?.profile?.name}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Iconify icon="solar:close-circle-linear" width={24} height={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <PetRegistrationUserAuthenticated
          onCancel={onClose}
          onSuccess={refetch}
        />
      </DialogContent>
    </Dialog>
  );
}
