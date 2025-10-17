import { fDate } from '@/src/utils/format-time';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { _socials } from 'src/_mock';
import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { IUserPetProfile } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  // user: IUserCard;
  pet: IUserPetProfile;
};

export default function UserCard({ pet }: Props) {
  const theme = useTheme();

  const { petName, photo, createdAt, updatedAt, petViewCounter, ownerPetName } =
    pet;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />

        <Avatar
          alt={petName}
          src={photo}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <Image
          src={photo}
          alt={photo}
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      <ListItemText
        sx={{ mt: 7, mb: 1 }}
        primary={petName}
        secondary={ownerPetName}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2.5 }}
      >
        {_socials.map((social) => (
          <IconButton
            key={social.name}
            sx={{
              color: social.color,
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        sx={{ py: 3, typography: 'subtitle1' }}
      >
        <div>
          <Typography
            variant="caption"
            component="div"
            sx={{ mb: 0.5, color: 'text.secondary' }}
          >
            Created at
          </Typography>
          {/* {fShortenNumber(totalFollowers)} */}
          {fDate(createdAt) || 'N/A'}
        </div>

        <div>
          <Typography
            variant="caption"
            component="div"
            sx={{ mb: 0.5, color: 'text.secondary' }}
          >
            Updated at
          </Typography>

          {/* {fShortenNumber(totalFollowing)} */}
          {fDate(updatedAt) || 'N/A'}
        </div>

        <div>
          <Typography
            variant="caption"
            component="div"
            sx={{ mb: 0.5, color: 'text.secondary' }}
          >
            Total Views
          </Typography>
          {petViewCounter.length}
        </div>
      </Box>
    </Card>
  );
}
