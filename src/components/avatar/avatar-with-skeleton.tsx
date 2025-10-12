import { useState } from 'react';

import { Avatar, Skeleton, AvatarProps } from '@mui/material';

interface AvatarWithSkeletonProps extends AvatarProps {
  src?: string;
  alt: string;
  showSkeleton?: boolean;
  skeletonWidth?: number;
  skeletonHeight?: number;
}

export function AvatarWithSkeleton({
  src,
  alt,
  showSkeleton = true,
  skeletonWidth = 48,
  skeletonHeight = 48,
  sx,
  ...props
}: AvatarWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  // Preload de la imagen (similar a lo que hace Next.js internamente)
  useState(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
  });

  // Mostrar skeleton mientras carga
  if (isLoading && showSkeleton) {
    return (
      <Skeleton
        variant="rounded"
        width={skeletonWidth}
        height={skeletonHeight}
        sx={sx}
      />
    );
  }

  // Mostrar avatar con inicial si hay error
  if (hasError || !src) {
    return (
      <Avatar
        sx={{
          width: skeletonWidth,
          height: skeletonHeight,
          bgcolor: 'grey.400',
          ...sx,
        }}
        {...props}
      >
        {alt?.charAt(0).toUpperCase() || '?'}
      </Avatar>
    );
  }

  // Mostrar imagen (ya sabemos que está cargada por el preload)
  return (
    <Avatar
      src={src}
      sx={{
        width: skeletonWidth,
        height: skeletonHeight,
        ...sx,
      }}
      alt={alt}
      {...props}
    />
  );
}
