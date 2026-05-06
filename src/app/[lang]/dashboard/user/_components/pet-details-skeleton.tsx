import React from 'react';

import {
  Box,
  Card,
  Grid,
  List,
  Stack,
  Divider,
  ListItem,
  Skeleton,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

export default function PetDetailsSkeleton() {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Primer Card - Información de la mascota */}
      <Card sx={{ p: 2, borderRadius: 3 }}>
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Skeleton
            variant="circular"
            width={100}
            height={100}
            sx={{ bgcolor: (theme) => theme.palette.action.hover }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Información detallada Skeleton */}
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Skeleton variant="text" width={60} height={36} />
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Stack spacing={2.5}>
              {[1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={120} height={24} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2.5}>
              {[1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={140} height={24} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* Segundo Card - Medical Summary Skeleton */}
      <Card sx={{ mt: 3, p: 2, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            <Skeleton variant="text" width={140} height={24} />
          </Typography>

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {/* Vacunas Skeleton */}
            <ListItem disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width={80} height={24} />}
                  secondary={
                    <Skeleton variant="text" width={100} height={20} />
                  }
                />
                <Skeleton
                  variant="text"
                  width={30}
                  height={30}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemButton>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Desparasitaciones Skeleton */}
            <ListItem disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width={100} height={24} />}
                  secondary={
                    <Skeleton variant="text" width={100} height={20} />
                  }
                />
                <Skeleton
                  variant="text"
                  width={30}
                  height={30}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemButton>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Visitas médicas Skeleton */}
            <ListItem disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width={110} height={24} />}
                  secondary={
                    <Skeleton variant="text" width={100} height={20} />
                  }
                />
                <Skeleton
                  variant="text"
                  width={30}
                  height={30}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
      </Card>
    </Box>
  );
}
