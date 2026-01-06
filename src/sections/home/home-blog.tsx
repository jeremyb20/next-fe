import { m } from 'framer-motion';
import { APP_NAME } from '@/src/config-global';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const BLOG_POSTS = [
  {
    title: 'Cuidados esenciales para cachorros',
    excerpt:
      'Aprende los cuidados básicos que tu nuevo cachorro necesita durante sus primeros meses...',
    image:
      'https://www.kiwoko.com/blogmundoanimal/wp-content/uploads/2020/01/cuidados-de-cachorros.jpg',
    date: '15 Nov 2024',
    category: 'Cuidados',
  },
  {
    title: 'Alimentación saludable para mascotas adultas',
    excerpt:
      'Descubre cómo elegir la mejor alimentación según la raza, tamaño y actividad de tu mascota...',
    image:
      'https://es.banfield.com/-/media/Project/Banfield/Main/en/PHADO/Diet/Hub/Main-header/20190721_001_1920x400.jpeg?rev=cb2ef18b8917450d8c0804029df3f98f',
    date: '12 Nov 2024',
    category: 'Nutrición',
  },
  {
    title: 'Señales de alerta en la salud de tu mascota',
    excerpt:
      'Conoce las señales que indican que tu mascota necesita atención veterinaria inmediata...',
    image:
      'https://www.infobae.com/resizer/v2/36VBXCTIG5CMDDB7OYRSNLAD7I.jpg?auth=055acf591d810d969bf439536337ae1a7fc63230a3504bc257b2354963ef2c8d&smart=true&width=992&height=558&quality=85',
    date: '10 Nov 2024',
    category: 'Salud',
  },
];

export default function HomeBlog() {
  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 10, md: 15 } }}>
      <Container component={MotionViewport}>
        <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2">Blog {APP_NAME}</Typography>
          </m.div>
          <m.div variants={varFade().inUp}>
            <Typography variant="h6" color="text.secondary">
              Consejos y información útil para el cuidado de tu mascota
            </Typography>
          </m.div>
        </Stack>

        <Box
          gap={4}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {BLOG_POSTS.map((post, index) => (
            <m.div key={post.title} variants={varFade().inUp}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: (theme) => theme.customShadows.z16,
                  },
                }}
              >
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                  }}
                />

                <Stack spacing={2} sx={{ p: 3, flexGrow: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="primary.main">
                      {post.category}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {post.date}
                    </Typography>
                  </Stack>

                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Button variant="text" sx={{ alignSelf: 'flex-start' }}>
                    Leer más
                  </Button>
                </Stack>
              </Card>
            </m.div>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <m.div variants={varFade().inUp}>
            <Button variant="outlined" size="large">
              Ver Todos los Artículos
            </Button>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
