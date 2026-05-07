// components/sticky-header/sticky-header.tsx
import { useState, useEffect, ReactNode } from 'react';

import { Box, Theme, SxProps, useTheme } from '@mui/material';

interface StickyHeaderProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  scrollThreshold?: number;
  elevatedPadding?: number;
  defaultPadding?: number;
}

export default function StickyHeader({
  children,
  sx,
  contentSx,
  scrollThreshold = 10,
  elevatedPadding = 8,
  defaultPadding = 2,
}: StickyHeaderProps) {
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: 'background.default',
        transition: 'padding 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        pt: isScrolled ? elevatedPadding : defaultPadding,
        ...(isScrolled && {
          boxShadow: theme.shadows[2],
          borderBottom: '1px solid',
          borderColor: 'divider',
        }),
        ...sx,
      }}
    >
      <Box sx={contentSx}>{children}</Box>
    </Box>
  );
}
