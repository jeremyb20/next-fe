import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

import { PATH_AFTER_LOGIN } from 'src/config-global';

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const { t } = useTranslation();
  return (
    <Button
      component={Link}
      href={PATH_AFTER_LOGIN}
      passHref
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      {t('Sign In')}
    </Button>
  );
}
