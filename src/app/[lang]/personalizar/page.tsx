import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';

import { getSeoMetadata } from '@/utils/seo-metadata';
import CustomizeView from '@/sections/customize/customize-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata('personalizar', language);

  return metadata;
}

// Componente de carga para Suspense
function RegisterPageLoading() {
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

export default function CustomizePage() {
  return (
    <Suspense fallback={<RegisterPageLoading />}>
      <CustomizeView />
    </Suspense>
  );
}
