// components/image/index.tsx
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { getRatio } from './utils';
import { ImageProps } from './types';

// ----------------------------------------------------------------------

// 🔥 Helper para generar srcSet responsivo con Cloudinary
const generateSrcSet = (
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
) => {
  if (!src?.includes('cloudinary.com')) return undefined;

  return widths
    .map((width) => {
      const optimizedUrl = src.replace(
        '/upload/',
        `/upload/w_${width},c_fill,q_75,f_auto/`
      );
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

// 🔥 Helper para optimizar URL de Cloudinary
const optimizeCloudinaryUrl = (src: string, isPriority: boolean = false) => {
  if (!src?.includes('cloudinary.com')) return src;

  const quality = isPriority ? 85 : 75;
  return src.replace('/upload/', `/upload/q_${quality},f_auto/`);
};

const Image = forwardRef<HTMLSpanElement, ImageProps>(
  (
    {
      ratio,
      overlay,
      disabledEffect = false,
      responsive = true,
      priority = false,
      //
      alt,
      src,
      afterLoad,
      delayTime,
      threshold,
      beforeLoad,
      delayMethod,
      placeholder,
      wrapperProps,
      scrollPosition,
      effect = 'blur',
      visibleByDefault,
      wrapperClassName,
      useIntersectionObserver,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const overlayStyles = !!overlay && {
      '&:before': {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: 'absolute',
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    // 🔥 Optimizar URL según prioridad
    const optimizedSrc = typeof src === 'string' ? optimizeCloudinaryUrl(src, priority) : src;

    // 🔥 Generar srcSet para imágenes responsivas
    const srcSet = responsive && typeof src === 'string' ? generateSrcSet(src) : undefined;
    const sizes = responsive
      ? '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : undefined;

    const content = (
      <Box
        component={LazyLoadImage}
        //
        alt={alt}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        afterLoad={afterLoad}
        delayTime={delayTime}
        threshold={threshold}
        beforeLoad={beforeLoad}
        delayMethod={delayMethod}
        placeholder={placeholder}
        wrapperProps={wrapperProps}
        scrollPosition={scrollPosition}
        visibleByDefault={priority ? true : visibleByDefault}
        effect={disabledEffect ? undefined : effect}
        useIntersectionObserver={priority ? false : useIntersectionObserver}
        wrapperClassName={wrapperClassName || 'component-image-wrapper'}
        placeholderSrc={
          disabledEffect ? '/assets/transparent.png' : '/assets/placeholder.svg'
        }
        //
        sx={{
          width: 1,
          height: 1,
          objectFit: 'cover',
          verticalAlign: 'bottom',
          ...(!!ratio && {
            top: 0,
            left: 0,
            position: 'absolute',
          }),
        }}
      />
    );

    return (
      <Box
        ref={ref}
        component="span"
        className="component-image"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          verticalAlign: 'bottom',
          display: 'inline-block',
          ...(!!ratio && {
            width: 1,
          }),
          '& span.component-image-wrapper': {
            width: 1,
            height: 1,
            verticalAlign: 'bottom',
            backgroundSize: 'cover !important',
            ...(!!ratio && {
              pt: getRatio(ratio),
            }),
          },
          ...overlayStyles,
          ...sx,
        }}
        {...other}
      >
        {content}
      </Box>
    );
  }
);

export default Image;
