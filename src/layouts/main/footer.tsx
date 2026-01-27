import Label from '@/src/components/label';
import { useTranslation } from 'react-i18next';
import { APP_NAME, EMAIL_SUPPORT } from '@/src/config-global';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { _socials } from 'src/_mock';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: APP_NAME,
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '/terms-and-conditions' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
  {
    headline: 'Contact',
    children: [{ name: EMAIL_SUPPORT, href: '#' }],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const homePage = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © {new Date().getFullYear()} {t('All rights reserved')}.
          <br /> {t('made by')}
          <Link href="https://jeremy-bacca-portfolio.netlify.app/">
            {' '}
            {APP_NAME}.{' '}
          </Link>
          <Link
            href={paths.auth.jwt.login}
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ ml: 1 }}
          >
            <Label
              color="info"
              sx={{ textTransform: 'unset', height: 22, px: 0.5 }}
            >
              v{process.env.APP_VERSION}
            </Label>
          </Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Logo sx={{ mb: 3 }} />

        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid xs={8} md={3}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              {t('Create a unique digital profile')}
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton
                  key={social.name}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                >
                  <Iconify color={social.color} icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="caption" component="div">
          © {new Date().getFullYear()} {t('All rights reserved')}.
          <br /> {t('made by')}
          <Link href="https://jeremy-bacca-portfolio.netlify.app/">
            {' '}
            {APP_NAME}.{' '}
          </Link>
          <Link
            href={paths.auth.jwt.login}
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ ml: 1 }}
          >
            <Label
              color="info"
              sx={{ textTransform: 'unset', height: 22, px: 0.5 }}
            >
              v{process.env.APP_VERSION}
            </Label>
          </Link>
        </Typography>
      </Container>
    </Box>
  );

  return homePage ? simpleFooter : mainFooter;
}
