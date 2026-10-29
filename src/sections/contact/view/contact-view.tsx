'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { _mapContact } from '@/_mock';

import ContactMap from '../contact-map';
import ContactForm from '../contact-form';
import ContactHero from '../contact-hero';
import ContactWhatsApp from '../contact-whatsapp';

// ----------------------------------------------------------------------

export default function ContactView() {
  return (
    <>
      <ContactHero />

      <Container sx={{ py: 10 }}>
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <ContactForm />

          <Box>
            <ContactWhatsApp />
            <Box sx={{ mt: 3 }}>
              <ContactMap contacts={_mapContact} />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
