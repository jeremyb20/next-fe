import Draggable from 'react-draggable';
import React, { useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/system/useMediaQuery';
import {
  Box,
  Paper,
  Typography,
  Slider,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import Iconify from '@/components/iconify';

import StepShape from './steps/StepShape';
import StepBackground from './steps/StepBackground';
import { shapeImages } from '../../utils/pet-tag-utils';
import {
  TagOption,
  PersonalizationData,
  TagFilters,
} from '../../types/pet-tag.types';

interface TagPreviewProps {
  tag: TagOption | null;
  filters: TagFilters;
  personalization: PersonalizationData;
  onPersonalizationChange?: (data: PersonalizationData) => void;
  onFilterChange?: (filters: Partial<TagFilters>) => void;
  onSelectBackground?: (background: string) => void;
  showControls?: boolean;
  activeSide?: 'front' | 'back';
}

export default function TagPreview({
  tag,
  filters,
  personalization,
  onPersonalizationChange,
  onFilterChange,
  onSelectBackground,
  showControls = false,
  activeSide = 'front',
}: TagPreviewProps) {
  const [shapeModalOpen, setShapeModalOpen] = useState(false);
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [localBackground, setLocalBackground] = useState(tag?.background || '');
  const [isHovering, setIsHovering] = useState(false);
  const [localFilters, setLocalFilters] = useState<TagFilters>(filters);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [isDraggingMold, setIsDraggingMold] = useState(false);

  // Estado local para las posiciones durante el arrastre
  const [localPositions, setLocalPositions] = useState<{
    name?: { x: number; y: number };
    phone?: { x: number; y: number };
    icon?: { x: number; y: number };
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const moldImgRef = useRef<HTMLImageElement>(null);
  const moldContainerRef = useRef<HTMLDivElement>(null);
  const moldInnerRef = useRef<HTMLDivElement>(null);

  // Ref para rastrear si estamos arrastrando
  const isDraggingRef = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!tag) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography color="text.secondary">
          Selecciona una plaquita para ver la vista previa
        </Typography>
      </Paper>
    );
  }

  // Datos de la cara activa
  const isBack = activeSide === 'back';
  const activePersonalization = isBack
    ? { ...personalization, ...(personalization.backPersonalization || {}) }
    : personalization;
  const activeBackground = isBack
    ? (personalization.backBackground || tag?.background || '')
    : (tag?.background || '');

  const handleActivePersonalizationChange = (data: PersonalizationData) => {
    if (!onPersonalizationChange) return;
    if (isBack) {
      const { doubleSided, backPersonalization, backBackground, ...rest } = data;
      onPersonalizationChange({ ...personalization, backPersonalization: rest });
    } else {
      onPersonalizationChange(data);
    }
  };

  const handleActiveBackgroundSelect = (bg: string) => {
    if (!onPersonalizationChange) return;
    if (isBack) {
      onPersonalizationChange({ ...personalization, backBackground: bg });
    } else if (onSelectBackground) {
      onSelectBackground(bg);
    }
  };

  const getMoldImage = () => shapeImages[filters.shape] || shapeImages.circle;

  const getTextStyles = (isPhone: boolean = false) => {
    let baseSize = activePersonalization.fontSize || 36;
    if (isPhone && activePersonalization.phoneFontSize !== undefined) {
      baseSize = activePersonalization.phoneFontSize;
    } else if (!isPhone && activePersonalization.nameFontSize !== undefined) {
      baseSize = activePersonalization.nameFontSize;
    }

    if (isPhone && activePersonalization.phoneFontSize === undefined) {
      baseSize = baseSize * 0.7;
    }

    const baseStyles = {
      fontWeight: 'bold',
      color: activePersonalization.fontColor || '#ffffff',
      fontSize: `${baseSize}px !important`,
      fontFamily: activePersonalization.fontFamily || 'Comic Sans MS',
      textShadow: '1px 1px 2px rgba(255,255,255,0.3)',
    };

    if (!activePersonalization.strokeWidth || activePersonalization.strokeWidth === 0) {
      return baseStyles;
    }

    const strokeColor = activePersonalization.strokeColor || '#000000';
    const strokeWidth = activePersonalization.strokeWidth;
    const position = activePersonalization.strokePosition || 'outside';

    switch (position) {
      case 'inside':
        return {
          ...baseStyles,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          textStroke: `${strokeWidth}px ${strokeColor}`,
          color: activePersonalization.fontColor || '#ffffff',
          paintOrder: 'stroke fill',
        };
      case 'center':
        return {
          ...baseStyles,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          textStroke: `${strokeWidth}px ${strokeColor}`,
          color: activePersonalization.fontColor || '#ffffff',
        };
      case 'outside':
      default: {
        const shadows = [];
        const steps = 8;
        const angleStep = (Math.PI * 2) / steps;
        for (let i = 0; i < steps; i++) {
          const angle = i * angleStep;
          const x = Math.cos(angle) * strokeWidth;
          const y = Math.sin(angle) * strokeWidth;
          shadows.push(`${x}px ${y}px 0 ${strokeColor}`);
        }
        return { ...baseStyles, textShadow: shadows.join(', ') };
      }
    }
  };

  const handleScaleChange = (event: Event, newValue: number | number[]) => {
    if (onPersonalizationChange) {
      handleActivePersonalizationChange({
        ...activePersonalization,
        moldScale: newValue as number,
      });
    }
  };

  const handleScaleAdjust = (delta: number) => {
    if (onPersonalizationChange) {
      const currentScale = activePersonalization.moldScale || 1;
      const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
      handleActivePersonalizationChange({ ...activePersonalization, moldScale: newScale });
    }
  };

  const getMoldBounds = () => {
    if (!moldImgRef.current) return null;
    const paper = moldImgRef.current.closest('.mold-paper') as HTMLElement;
    if (!paper) return null;
    const imgRect = moldImgRef.current.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();

    const scale = personalization.moldScale || 1;
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;

    const visibleWidth = imgWidth / scale;
    const visibleHeight = imgHeight / scale;

    const offsetX = (imgWidth - visibleWidth) / 2;
    const offsetY = (imgHeight - visibleHeight) / 2;

    return {
      left: imgRect.left - paperRect.left + offsetX,
      top: imgRect.top - paperRect.top + offsetY,
      width: visibleWidth,
      height: visibleHeight,
    };
  };

  const getElementPosition = (element: 'name' | 'phone' | 'icon') => {
    const positionKey = `${element}Position` as keyof PersonalizationData;

    if (isDraggingRef.current && localPositions[element]) {
      return localPositions[element]!;
    }

    const position = activePersonalization[positionKey] as
      | { x: number; y: number }
      | undefined;

    if (!position) {
      switch (element) {
        case 'icon':
          return { x: 50, y: 25 };
        case 'name':
          return { x: 50, y: 45 };
        case 'phone':
          return { x: 50, y: 65 };
        default:
          return { x: 50, y: 50 };
      }
    }

    return {
      x: Math.max(0, Math.min(100, position.x)),
      y: Math.max(0, Math.min(100, position.y)),
    };
  };

  const getTextOffset = (text: string, isPhone: boolean = false) => {
    let fontSize = activePersonalization.fontSize || 36;
    if (isPhone && activePersonalization.phoneFontSize !== undefined) {
      fontSize = activePersonalization.phoneFontSize;
    } else if (!isPhone && activePersonalization.nameFontSize !== undefined) {
      fontSize = activePersonalization.nameFontSize;
    } else if (isPhone && activePersonalization.phoneFontSize === undefined) {
      fontSize = fontSize * 0.7;
    }

    const charWidth = isPhone ? fontSize * 0.3 : fontSize * 0.4;
    return {
      width: (text.length * charWidth) / 2,
      height: fontSize / 2,
    };
  };

  const getElementOffset = (element: 'name' | 'phone' | 'icon') => {
    if (element === 'icon') {
      return { width: 24, height: 24 };
    }

    const text =
      element === 'name'
        ? personalization.name || tag.name || ''
        : personalization.phone || '';
    return getTextOffset(text, element === 'phone');
  };

  const getDraggablePosition = (
    element: 'name' | 'phone' | 'icon',
    offsetW = 0,
    offsetH = 0
  ) => {
    const pos = getElementPosition(element);
    const b = getMoldBounds();
    if (!b) return { x: 0, y: 0 };

    const elementX = b.left + (pos.x / 100) * b.width;
    const elementY = b.top + (pos.y / 100) * b.height;

    return {
      x: elementX - offsetW,
      y: elementY - offsetH,
    };
  };

  const getDraggableBounds = (offsetW = 0, offsetH = 0) => {
    const b = getMoldBounds();
    if (!b) return 'parent' as const;
    return {
      left: b.left - offsetW,
      top: b.top - offsetH,
      right: b.left + b.width - offsetW,
      bottom: b.top + b.height - offsetH,
    };
  };

  const handleDragStart = (element: 'name' | 'phone' | 'icon') => {
    isDraggingRef.current = true;
    setDraggingElement(element);
  };

  const handleDrag =
    (element: 'name' | 'phone' | 'icon') => (e: any, data: any) => {
      const b = getMoldBounds();
      if (!b) return;

      const offset = getElementOffset(element);
      const elementX = data.x + offset.width;
      const elementY = data.y + offset.height;

      const x = Math.max(
        0,
        Math.min(100, ((elementX - b.left) / b.width) * 100)
      );
      const y = Math.max(
        0,
        Math.min(100, ((elementY - b.top) / b.height) * 100)
      );

      setLocalPositions((prev) => ({
        ...prev,
        [element]: { x, y },
      }));
    };

  const handleDragStop = (element: 'name' | 'phone' | 'icon') => {
    isDraggingRef.current = false;
    setDraggingElement(null);

    if (localPositions[element] && onPersonalizationChange) {
      const positionKey = `${element}Position` as keyof PersonalizationData;
      handleActivePersonalizationChange({
        ...activePersonalization,
        [positionKey]: localPositions[element],
      });
    }

    setLocalPositions((prev) => ({
      ...prev,
      [element]: undefined,
    }));
  };

  // Manejadores para arrastrar el molde
  const handleMoldDragStart = () => {
    setIsDraggingMold(true);
  };

  const handleMoldDrag = (e: any, data: any) => {
    if (onPersonalizationChange) {
      handleActivePersonalizationChange({
        ...activePersonalization,
        moldPosition: { x: data.x, y: data.y },
      });
    }
  };

  const handleMoldDragStop = () => {
    setIsDraggingMold(false);
  };

  const moldScale = activePersonalization.moldScale || 1;
  const showName = activePersonalization.name || tag.name || '';
  const showPhone = activePersonalization.phone || '';
  const nameOffset = getTextOffset(showName);
  const phoneOffset = getTextOffset(showPhone, true);

  const moldPosition = activePersonalization.moldPosition || { x: 0, y: 0 };

  const handleShapeConfirm = () => {
    if (onFilterChange) onFilterChange(localFilters);
    setShapeModalOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 0, sm: 3 },
          width: '100%',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Paper
          elevation={3}
          className="mold-paper"
          sx={{
            width: 380,
            height: 240,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: activeBackground ? `url(${activeBackground})` : 'red',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'all 0.3s ease',
            backgroundColor: 'red',
            cursor: draggingElement || isDraggingMold ? 'grabbing' : 'default',
          }}
        >
          {/* Draggable para la posición del molde */}
          <Draggable
            position={moldPosition}
            onStart={handleMoldDragStart}
            onDrag={handleMoldDrag}
            onStop={handleMoldDragStop}
            disabled={!showControls}
            bounds={{
              left: -190,
              top: -120,
              right: 190,
              bottom: 120,
            }}
            nodeRef={moldContainerRef}
          >
            <Box
              ref={moldContainerRef}
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: showControls ? 'auto' : 'none',
                cursor: isDraggingMold
                  ? 'grabbing'
                  : showControls
                    ? 'grab'
                    : 'default',
                touchAction: 'none',
                zIndex: 0,
              }}
            >
              {/* Contenedor interno con la escala */}
              <Box
                ref={moldInnerRef}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${moldScale})`,
                  transition: isDraggingMold ? 'none' : 'transform 0.3s ease',
                  position: 'relative',
                }}
              >
                {/* Indicador de arrastre para el molde */}
                {showControls &&
                  isHovering &&
                  !draggingElement &&
                  !isDraggingMold && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 57,
                        right: 58,
                        zIndex: 10,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        borderRadius: 2,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pointerEvents: 'none',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 0.6 },
                          '50%': { opacity: 1 },
                          '100%': { opacity: 0.6 },
                        },
                      }}
                    >
                      <Iconify
                        icon="iconoir:drag"
                        width={10}
                        sx={{ color: 'white' }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontSize: '8px !important',
                        }}
                      >
                        Mover molde
                      </Typography>
                    </Box>
                  )}

                {/* Indicador cuando está arrastrando */}
                {isDraggingMold && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 57,
                      right: 58,
                      zIndex: 10,
                      bgcolor: 'rgba(0,0,0,0.8)',
                      borderRadius: 2,
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      pointerEvents: 'none',
                    }}
                  >
                    <Iconify
                      icon="mdi:gesture-tap"
                      width={10}
                      sx={{ color: '#4CAF50' }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '8px !important',
                      }}
                    >
                      Arrastrando...
                    </Typography>
                  </Box>
                )}

                <img
                  ref={moldImgRef}
                  src={getMoldImage()}
                  alt={`Molde ${tag.shape}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />
              </Box>
            </Box>
          </Draggable>

          {/* Contenedor para elementos draggable */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {/* Icono */}
            {personalization.icon && (
              <Draggable
                nodeRef={iconRef}
                position={getDraggablePosition('icon', 24, 24)}
                onStart={() => handleDragStart('icon')}
                onDrag={handleDrag('icon')}
                onStop={() => handleDragStop('icon')}
                bounds={getDraggableBounds(24, 24)}
                disabled={!showControls}
              >
                <Box
                  ref={iconRef}
                  sx={{
                    position: 'absolute',
                    pointerEvents: showControls ? 'auto' : 'none',
                    cursor: showControls ? 'grab' : 'default',
                    '&:active': { cursor: 'grabbing' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor:
                      draggingElement === 'icon'
                        ? 'rgba(255,255,255,0.2)'
                        : 'transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: 36,
                      position: 'relative',
                      zIndex: 2,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {personalization.icon}
                  </Typography>
                  {showControls && isHovering && (
                    <Tooltip title="Arrastrar ícono">
                      <Iconify
                        icon="iconoir:drag"
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          fontSize: 14,
                          color: 'rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Draggable>
            )}

            {/* Nombre */}
            <Draggable
              nodeRef={nameRef}
              position={getDraggablePosition(
                'name',
                nameOffset.width,
                nameOffset.height
              )}
              onStart={() => handleDragStart('name')}
              onDrag={handleDrag('name')}
              onStop={() => handleDragStop('name')}
              bounds={getDraggableBounds(nameOffset.width, nameOffset.height)}
              disabled={!showControls}
            >
              <Box
                ref={nameRef}
                sx={{
                  position: 'absolute',
                  pointerEvents: showControls ? 'auto' : 'none',
                  cursor: showControls ? 'grab' : 'default',
                  '&:active': { cursor: 'grabbing' },
                  padding: '4px 8px',
                  borderRadius: 1,
                  bgcolor:
                    draggingElement === 'name'
                      ? 'rgba(255,255,255,0.2)'
                      : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Typography
                  sx={{
                    ...getTextStyles(false),
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {showName}
                </Typography>
                {showControls && isHovering && (
                  <Tooltip title="Arrastrar nombre">
                    <Iconify
                      icon="iconoir:drag"
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        fontSize: 14,
                        color: 'rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </Draggable>

            {/* Teléfono */}
            {showPhone && (
              <Draggable
                nodeRef={phoneRef}
                position={getDraggablePosition(
                  'phone',
                  phoneOffset.width,
                  phoneOffset.height
                )}
                onStart={() => handleDragStart('phone')}
                onDrag={handleDrag('phone')}
                onStop={() => handleDragStop('phone')}
                bounds={getDraggableBounds(
                  phoneOffset.width,
                  phoneOffset.height
                )}
                disabled={!showControls}
              >
                <Box
                  ref={phoneRef}
                  sx={{
                    position: 'absolute',
                    pointerEvents: showControls ? 'auto' : 'none',
                    cursor: showControls ? 'grab' : 'default',
                    '&:active': { cursor: 'grabbing' },
                    padding: '4px 8px',
                    borderRadius: 1,
                    bgcolor:
                      draggingElement === 'phone'
                        ? 'rgba(255,255,255,0.2)'
                        : 'transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Typography
                    sx={{
                      ...getTextStyles(true),
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {showPhone}
                  </Typography>
                  {showControls && isHovering && (
                    <Tooltip title="Arrastrar teléfono">
                      <Iconify
                        icon="iconoir:drag"
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          fontSize: 14,
                          color: 'rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Draggable>
            )}
          </Box>

          {/* Controles de escala (hover) */}
          {showControls && onPersonalizationChange && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                display: 'flex',
                gap: 1,
                zIndex: 10,
                bgcolor: 'rgba(0,0,0,0.7)',
                borderRadius: 2,
                p: 0.5,
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: isHovering ? 'auto' : 'none',
              }}
            >
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => handleScaleAdjust(-0.1)}
                disabled={moldScale <= 0.5}
              >
                <Iconify icon="gg:remove" />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                }}
              >
                {Math.round(moldScale * 100)}%
              </Typography>
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => handleScaleAdjust(0.1)}
                disabled={moldScale >= 2}
              >
                <Iconify icon="gg:add" />
              </IconButton>
            </Box>
          )}
        </Paper>
      </Box>

      {showControls && (
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {(onSelectBackground || isBack) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setLocalBackground(activeBackground);
                setBgModalOpen(true);
              }}
            >
              Cambiar fondos
            </Button>
          )}
          {onFilterChange && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setLocalFilters(filters);
                setShapeModalOpen(true);
              }}
            >
              Cambiar forma
            </Button>
          )}
        </Box>
      )}

      {/* Modal de fondos */}
      <Dialog
        open={bgModalOpen}
        onClose={() => setBgModalOpen(false)}
        maxWidth="md"
        scroll="body"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Cambiar fondo</DialogTitle>
        <DialogContent>
          <StepBackground
            selectedBackground={localBackground}
            onSelectBackground={setLocalBackground}
            onNext={() => {
              handleActiveBackgroundSelect(localBackground);
              setBgModalOpen(false);
            }}
            onBack={() => setBgModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de forma */}
      <Dialog
        open={shapeModalOpen}
        onClose={() => setShapeModalOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Cambiar forma</DialogTitle>
        <DialogContent>
          <StepShape
            filters={localFilters}
            onFilterChange={(f) =>
              setLocalFilters((prev) => ({ ...prev, ...f }))
            }
            onNext={handleShapeConfirm}
            isShapeStep
            hideBackButtom
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShapeModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleShapeConfirm}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {showControls && onPersonalizationChange && (
        <Box sx={{ width: '80%', maxWidth: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Tamaño del molde
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(moldScale * 100)}%
            </Typography>
          </Box>
          <Slider
            value={moldScale}
            onChange={handleScaleChange}
            min={0.5}
            max={2}
            step={0.05}
            marks={[
              { value: 0.5, label: '50%' },
              { value: 1, label: '100%' },
              { value: 1.5, label: '150%' },
              { value: 2, label: '200%' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </Box>
      )}
    </Box>
  );
}
