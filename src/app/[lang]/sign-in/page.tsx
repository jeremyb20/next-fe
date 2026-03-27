import { Metadata } from 'next';
import { Suspense } from 'react';
import { JwtLoginView } from '@/sections/auth/jwt';
import { getSeoMetadata } from '@/utils/seo-metadata';

import { Box, Container, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  // Obtener el idioma de los params, asegurando que sea válido
  const lang = params?.lang?.toUpperCase() || 'ES';
  const supportedLanguages = ['ES', 'EN', 'AR', 'VI', 'ZH', 'FR'];
  const validLang = supportedLanguages.includes(lang) ? lang : 'ES';

  return getSeoMetadata('sign-in', validLang);
}

// Componente de carga para Suspense
function LoginPageLoading() {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <JwtLoginView />
    </Suspense>
  );
}
