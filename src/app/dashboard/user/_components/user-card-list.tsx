import Box from '@mui/material/Box';

// import { IUserCard } from 'src/types/user';

import { IUserPetProfile } from '@/src/types/user';

import UserCard from './user-card';

// ----------------------------------------------------------------------

type Props = {
  // users: IUserCard[];
  pets: IUserPetProfile[];
};

export default function UserCardList({ pets }: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {pets.map((pet) => (
        <UserCard key={pet._id} pet={pet} />
      ))}
    </Box>
  );
}
