import { useState, useEffect } from 'react';
import { m, MotionProps } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SplashScreen } from '@/src/components/loading-screen';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

const CONTACTS = [
  {
    country: 'Costa Rica',
    address: 'San José, Costa Rica, Desamparados CR 10307',
    phoneNumber: '(239) 555-0108',
  },
];

// ----------------------------------------------------------------------

export default function ContactHero() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/images/contact/hero.jpeg',
        }),
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container component={MotionContainer}>
        {!isClient ? (
          <SplashScreen />
        ) : (
          <Box
            sx={{
              bottom: { md: 80 },
              position: { md: 'absolute' },
              textAlign: { xs: 'center', md: 'unset' },
            }}
          >
            <TextAnimate
              text={t('Where')}
              sx={{ color: 'primary.main' }}
              variants={varFade().inRight}
            />
            <br />

            <Stack
              spacing={2}
              display="inline-flex"
              direction="row"
              sx={{ color: 'common.white' }}
            >
              <TextAnimate text={t('to')} />
              <TextAnimate text={t('find')} />
              <TextAnimate text={t('us?')} />
            </Stack>

            <Stack
              spacing={5}
              alignItems={{ xs: 'center', md: 'unset' }}
              direction={{ xs: 'column', md: 'row' }}
              sx={{ mt: 5, color: 'common.white' }}
            >
              {CONTACTS.map((contact) => (
                <Stack key={contact.country} sx={{ maxWidth: 180 }}>
                  <m.div variants={varFade().in}>
                    <Typography variant="h6" gutterBottom>
                      {contact.country}
                    </Typography>
                  </m.div>

                  <m.div variants={varFade().inRight}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {contact.address}
                    </Typography>
                  </m.div>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TextAnimateProps = BoxProps &
  MotionProps & {
    text: string;
  };

function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}
