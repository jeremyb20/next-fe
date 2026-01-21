import { m } from 'framer-motion';
import { APP_NAME } from '@/src/config-global';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const BLOG_POSTS = [
  {
    title: 'Tips and useful information for caring for your pet',
    excerpt:
      'Learn the basic care your new puppy needs during its first few months...',
    image:
      'https://www.kiwoko.com/blogmundoanimal/wp-content/uploads/2020/01/cuidados-de-cachorros.jpg',
    date: '15 Nov 2024',
    category: 'Care',
  },
  {
    title: 'Healthy nutrition for adult pets',
    excerpt:
      "Discover how to choose the best diet according to your pet's breed, size and activity...",
    image:
      'https://es.banfield.com/-/media/Project/Banfield/Main/en/PHADO/Diet/Hub/Main-header/20190721_001_1920x400.jpeg?rev=cb2ef18b8917450d8c0804029df3f98f',
    date: '12 Nov 2024',
    category: 'Nutrition',
  },
  {
    title: 'Signs of Alert in Your Pets Health',
    excerpt:
      'Learn the signs that indicate your pet needs immediate veterinary attention...',
    image:
      'https://www.infobae.com/resizer/v2/36VBXCTIG5CMDDB7OYRSNLAD7I.jpg?auth=055acf591d810d969bf439536337ae1a7fc63230a3504bc257b2354963ef2c8d&smart=true&width=992&height=558&quality=85',
    date: '10 Nov 2024',
    category: 'Health',
  },
];

export default function HomeBlog() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 10, md: 15 } }}>
      <Container component={MotionViewport}>
        <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2">
              {t('Blog')} {APP_NAME}
            </Typography>
          </m.div>
          <m.div variants={varFade().inUp}>
            <Typography variant="h6" color="text.secondary">
              {t('Tips and useful information for your pet care')}
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
                    {t(post.title)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {t(post.excerpt)}
                  </Typography>

                  <Button variant="text" sx={{ alignSelf: 'flex-start' }}>
                    {t('Read more')}
                  </Button>
                </Stack>
              </Card>
            </m.div>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <m.div variants={varFade().inUp}>
            <Button variant="outlined" size="large">
              {t('Know more')}
            </Button>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
