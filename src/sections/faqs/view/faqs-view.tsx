'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import ContactForm from '@/sections/contact/contact-form';

import FaqsHero from '../faqs-hero';
import FaqsList from '../faqs-list';

// ----------------------------------------------------------------------

export default function FaqsView() {
  return (
    <>
      <FaqsHero />

      <Container
        sx={{
          pb: 10,
          pt: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        {/* <FaqsCategory /> */}

        {/* <Typography
          variant="h3"
          sx={{
            my: { xs: 5, md: 10 },
          }}
        >
          Frequently asked questions
        </Typography> */}

        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <FaqsList />

          <ContactForm />
        </Box>
      </Container>
    </>
  );
}
