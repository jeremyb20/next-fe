import Link from 'next/link';

import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

import { PATH_AFTER_LOGIN } from 'src/config-global';

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  return (
    <Button
      component={Link}
      href={PATH_AFTER_LOGIN}
      passHref
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      Login
    </Button>
  );
}
