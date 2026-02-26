import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { fToNow } from '@/utils/format-time';
import { BreedOptions } from '@/utils/constants';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import { Stack } from '@mui/system';
import {
  Box,
  Card,
  Avatar,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

interface PetCardProps {
  pet: IPetProfile;
  index: number;
  onDelete?: (pet: IPetProfile) => void;
  onView?: (pet: IPetProfile) => void;
  onEdit?: (pet: IPetProfile) => void;
}

export function PetCard({
  pet,
  index,
  onDelete,
  onView,
  onEdit,
}: PetCardProps) {
  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    onDelete?.(pet);
  };

  const handleView = () => {
    popover.onClose();
    onView?.(pet);
  };

  const handleEdit = () => {
    popover.onClose();
    onEdit?.(pet);
  };

  return (
    <>
      <Card
        sx={{
          flex: 1,
          borderRadius: 4,
          bgcolor: 'background.neutral',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Avatar
              src={pet.photo}
              sx={{ width: 80, height: 80 }}
              alt={pet.petName}
            >
              {pet.petName?.charAt(0) || '?'}
            </Avatar>
            <IconButton
              size="small"
              sx={{ color: '#fff' }}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
          <Stack direction="row" justifyContent="space-between">
            <Stack>
              <Typography variant="h6" fontWeight={600}>
                {pet.petName || 'No name'}
              </Typography>
              <Stack
                spacing={{ xs: 0, md: 1 }}
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
              >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {BreedOptions.todos.find((breed) => breed.value === pet.breed)
                    ?.label || 'Unknown breed'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Updated: {fToNow(pet.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        // anchorEl={popover?.anchorEl}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleView}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
