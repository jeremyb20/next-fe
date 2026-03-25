'use client';

import { m } from 'framer-motion';
import CompactLayout from '@/layouts/compact';
import { RouterLink } from '@/routes/components';
import { SeverErrorIllustration } from '@/assets/illustrations';
import { varBounce, MotionContainer } from '@/components/animate';

import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function Page500({ errorMsg }: { errorMsg?: string | null }) {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            500 Internal Server Error
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            There was an error, please try again later.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          sx={{ mb: 2 }}
        >
          Go to Home
        </Button>
        <m.div variants={varBounce().in}>
          <Alert severity="info">{errorMsg || 'Error loading pets'}</Alert>
        </m.div>
      </MotionContainer>
    </CompactLayout>
  );
}
