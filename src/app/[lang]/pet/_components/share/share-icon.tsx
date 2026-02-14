import Iconify from '@/src/components/iconify';

import { Box } from '@mui/material';

export const ShareIcon = ({
  platform,
  size = 48,
}: {
  platform: string;
  size?: number;
}) => {
  const iconStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: size * 0.5,
  };

  const platformStyles: { [key: string]: any } = {
    facebook: {
      backgroundColor: '#1877F2',
      icon: 'eva:facebook-fill',
    },
    twitter: {
      backgroundColor: '#000000',
      icon: 'ri:twitter-x-fill',
    },
    whatsapp: {
      backgroundColor: '#25D366',
      icon: 'ic:baseline-whatsapp',
    },
    telegram: {
      backgroundColor: '#0088CC',
      icon: 'ic:baseline-telegram',
    },
    email: {
      backgroundColor: '#EA4335',
      icon: 'ic:baseline-email',
    },
  };

  const style = platformStyles[platform] || platformStyles.facebook;

  return (
    <Box sx={{ ...iconStyle, backgroundColor: style.backgroundColor }}>
      <Iconify icon={style.icon} width={size * 0.5} />
    </Box>
  );
};
