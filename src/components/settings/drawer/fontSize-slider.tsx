'use client';

import { Box, Stack, Slider, Typography } from '@mui/material';

import { useSettingsContext } from '../context';

interface Props {
  sx: React.CSSProperties;
}

export function FontSizeSlider({ sx }: Props) {
  const settings = useSettingsContext();

  const handleChange = (event: Event, newValue: number | number[]) => {
    settings.onUpdate('fontSizeScale', newValue as number);
  };

  const marks = [
    { value: 0.75, label: 'Small' },
    { value: 1, label: 'Normal' },
    { value: 1.25, label: 'Large' },
    { value: 1.5, label: 'X-Large' },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Typography variant="caption" component="div" sx={{ ...sx }}>
          Font Size
        </Typography>
        <Typography
          variant="caption"
          color="primary"
          fontWeight="fontWeightSemiBold"
        >
          {Math.round((settings.fontSizeScale || 1) * 100)}%
        </Typography>
      </Stack>

      <Box sx={{ p: 2 }}>
        <Slider
          value={settings.fontSizeScale || 1}
          onChange={handleChange}
          min={0.75}
          max={1.5}
          step={0.05}
          marks={marks}
          valueLabelDisplay="auto"
          size="medium"
          valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          sx={{
            mt: 2,
            '& .MuiSlider-markLabel': {
              fontSize: '0.75rem',
              color: 'text.disabled',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.disabled">
          75%
        </Typography>
        <Typography variant="caption" color="text.disabled">
          150%
        </Typography>
      </Box>
    </Box>
  );
}
