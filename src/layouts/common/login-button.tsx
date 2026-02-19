import { useTranslation } from 'react-i18next';
import { PATH_AFTER_LOGIN } from '@/config-global';
import RouterLink from '@/routes/components/router-link';

import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const { t } = useTranslation();
  return (
    <Button
      component={RouterLink}
      href={PATH_AFTER_LOGIN}
      passHref
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      {t('Sign In')}
    </Button>
  );
}
