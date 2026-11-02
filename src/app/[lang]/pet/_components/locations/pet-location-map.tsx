'use client';

// components/dashboard/user/pet-location-map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Map as MLMap,
  Marker,
  ScaleControl,
  FullscreenControl,
  NavigationControl,
  setWorkerUrl,
  getVersion,
  type MapMouseEvent,
} from 'maplibre-gl';

import Iconify from '@/components/iconify';
import { useSnackbar } from '@/components/snackbar';
import { useTranslation } from '@/hooks/use-translation';

// ----------------------------------------------------------------------

setWorkerUrl(
  `https://cdn.jsdelivr.net/npm/maplibre-gl@${getVersion()}/dist/maplibre-gl-worker.mjs`
);

const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/bright',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 500,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .maplibregl-ctrl-logo, .maplibregl-ctrl-bottom-right': {
    display: 'none',
  },
}));

const MapContainer = styled('div')({
  width: '100%',
  height: '100%',
});

const ControlsBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  zIndex: 1,
  boxShadow: theme.shadows[2],
  backdropFilter: 'blur(8px)',
  [theme.breakpoints.up('sm')]: {
    left: 'auto',
    minWidth: 320,
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    left: 'auto',
    width: 320,
  },
}));

interface PetLocation {
  lat: string;
  lng: string;
  address?: string;
}

interface PetLocationMapProps {
  initialLocation?: PetLocation;
  onLocationChange: (location: PetLocation) => void;
  readOnly?: boolean;
}

export default function PetLocationMap({
  initialLocation,
  onLocationChange,
  readOnly = false,
}: PetLocationMapProps) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const lightMode = theme.palette.mode === 'light';
  const { t } = useTranslation();

  const initialLat = initialLocation?.lat
    ? parseFloat(initialLocation.lat)
    : 9.9281;
  const initialLng = initialLocation?.lng
    ? parseFloat(initialLocation.lng)
    : -84.0907;

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation?.lat && initialLocation?.lng
      ? [initialLat, initialLng]
      : null
  );

  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [mapsDialogOpen, setMapsDialogOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const initialCenterRef = useRef<[number, number]>([initialLng, initialLat]);
  const initialStyleRef = useRef(
    lightMode ? MAP_STYLES.light : MAP_STYLES.dark
  );
  const styleRef = useRef(initialStyleRef.current);
  const readOnlyRef = useRef(readOnly);

  // Obtener dirección a partir de coordenadas (reverse geocoding)
  const getAddressFromCoords = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `${NOMINATIM_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.display_name) {
          const formattedAddress: string = data.display_name;
          setAddress(formattedAddress);
          onLocationChange({
            lat: lat.toString(),
            lng: lng.toString(),
            address: formattedAddress,
          });
          return formattedAddress;
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }
      return null;
    },
    [onLocationChange]
  );

  // Manejar click en el mapa
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (readOnly) return;

      mapRef.current?.easeTo({ center: [lng, lat] });
      setMarkerPosition([lat, lng]);

      const formattedAddress = await getAddressFromCoords(lat, lng);

      if (!formattedAddress) {
        const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(fallback);
        onLocationChange({
          lat: lat.toString(),
          lng: lng.toString(),
          address: fallback,
        });
      }

      enqueueSnackbar(t('Update success!'), {
        variant: 'success',
      });
    },
    [readOnly, getAddressFromCoords, enqueueSnackbar, t, onLocationChange]
  );

  // Manejar fin del arrastre del marcador
  const handleMarkerDragEnd = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPosition([lat, lng]);

      const formattedAddress = await getAddressFromCoords(lat, lng);

      if (!formattedAddress) {
        onLocationChange({
          lat: lat.toString(),
          lng: lng.toString(),
          address,
        });
      }
    },
    [address, getAddressFromCoords, onLocationChange]
  );

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MLMap({
      container: containerRef.current,
      style: initialStyleRef.current,
      center: initialCenterRef.current,
      zoom: 15,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({ showCompass: false }),
      'bottom-left'
    );
    map.addControl(
      new ScaleControl({ maxWidth: 100, unit: 'metric' }),
      'bottom-left'
    );

    if (!readOnlyRef.current) {
      map.addControl(new FullscreenControl(), 'top-left');
    }

    map.on('styleimagemissing', (e) => {
      map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Click en el mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const onClick = (event: MapMouseEvent) => {
      handleMapClick(event.lngLat.lat, event.lngLat.lng);
    };

    map.on('click', onClick);

    return () => {
      map.off('click', onClick);
    };
  }, [handleMapClick]);

  // Crear / mover / eliminar marcador
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!markerPosition) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const [lat, lng] = markerPosition;

    if (!markerRef.current) {
      markerRef.current = new Marker({
        color: readOnly ? '#666' : '#FF6B6B',
        draggable: !readOnly,
      })
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
      markerRef.current.setDraggable(!readOnly);
    }
  }, [markerPosition, readOnly]);

  // Arrastrar marcador
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;

    const onDragEnd = () => {
      const lngLat = marker.getLngLat();
      handleMarkerDragEnd(lngLat.lat, lngLat.lng);
    };

    marker.on('dragend', onDragEnd);

    return () => {
      marker.off('dragend', onDragEnd);
    };
  }, [markerPosition, handleMarkerDragEnd]);

  // Cambiar estilo cuando cambia el tema
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextStyle = lightMode ? MAP_STYLES.light : MAP_STYLES.dark;

    if (styleRef.current === nextStyle) return;

    styleRef.current = nextStyle;
    map.setStyle(nextStyle);
  }, [lightMode]);

  // Cursor del mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.getCanvas().style.cursor = readOnly ? 'default' : 'crosshair';
  }, [readOnly]);

  // Geocoding: buscar dirección y obtener coordenadas
  const searchLocation = useCallback(async () => {
    if (!searchAddress.trim()) {
      enqueueSnackbar(t('Please enter an address'), {
        variant: 'error',
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${NOMINATIM_URL}/search?format=jsonv2&q=${encodeURIComponent(
          searchAddress
        )}&countrycodes=cr&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        const formattedAddress: string = data[0].display_name;

        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 800,
        });
        setMarkerPosition([latitude, longitude]);
        setAddress(formattedAddress);

        onLocationChange({
          lat: latitude.toString(),
          lng: longitude.toString(),
          address: formattedAddress,
        });

        enqueueSnackbar(t('Location found!'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('Address not found'), {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);

      enqueueSnackbar(t('Error searching location'), {
        variant: 'error',
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchAddress, enqueueSnackbar, t, onLocationChange]);

  // Usar ubicación actual del dispositivo
  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      enqueueSnackbar(t('Geolocation not supported'), {
        variant: 'error',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 5,
          duration: 800,
        });
        setMarkerPosition([latitude, longitude]);

        const formattedAddress = await getAddressFromCoords(
          latitude,
          longitude
        );

        if (formattedAddress) {
          setAddress(formattedAddress);
        } else {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          onLocationChange({
            lat: latitude.toString(),
            lng: longitude.toString(),
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }

        enqueueSnackbar(t('Current location set!'), {
          variant: 'success',
        });
      },
      (error) => {
        console.error('Error getting location:', error);

        enqueueSnackbar(t('Error getting location'), {
          variant: 'error',
        });
      }
    );
  }, [enqueueSnackbar, getAddressFromCoords, onLocationChange, t]);

  // Abrir la ubicación en una app externa
  const openExternalMap = useCallback((provider: 'waze' | 'google') => {
    if (!markerPosition) return;

    const [lat, lng] = markerPosition;

    const url =
      provider === 'waze'
        ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    setMapsDialogOpen(false);
  }, [markerPosition]);

  // Limpiar ubicación
  const clearLocation = useCallback(() => {
    setMarkerPosition(null);
    setAddress('');
    setSearchAddress('');
    onLocationChange({
      lat: '',
      lng: '',
      address: '',
    });
  }, [onLocationChange]);

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledRoot>
        <MapContainer ref={containerRef} />

        {!readOnly && (
          <>
            <SearchBox>
              <TextField
                fullWidth
                size="small"
                placeholder={t('Search address...')}
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" width={18} />
                    </InputAdornment>
                  ),
                  endAdornment: isSearching && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </SearchBox>

            <ControlsBox>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify icon="eva:pin-fill" width={18} />
                {t('Pet Location')}
              </Typography>

              {address ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: 'text.secondary' }}
                  >
                    {address}
                  </Typography>
                  {markerPosition && (
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 1.5,
                        display: 'block',
                        fontFamily: 'monospace',
                      }}
                    >
                      📍 {markerPosition[0].toFixed(6)},{' '}
                      {markerPosition[1].toFixed(6)}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5, color: 'text.secondary' }}
                >
                  {t(
                    'Click on the map to set your pet location or search for an address'
                  )}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="eva:search-fill" width={16} />}
                  onClick={searchLocation}
                  disabled={isSearching || !searchAddress}
                >
                  {t('Search')}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="eva:pin-fill" width={16} />}
                  onClick={useCurrentLocation}
                >
                  {t('My Location')}
                </Button>
                {markerPosition && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-fill" width={16} />}
                    onClick={clearLocation}
                  >
                    {t('Clear')}
                  </Button>
                )}
              </Box>
            </ControlsBox>
          </>
        )}

        {readOnly && markerPosition && (
          <ControlsBox>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Iconify icon="eva:pin-fill" width={18} />
              📍 {t('Pet Location')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {address ||
                `${markerPosition[0].toFixed(6)}, ${markerPosition[1].toFixed(
                  6
                )}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              📍 {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
            </Typography>

            <Box sx={{ mt: 1.5 }}>
              <Button
                fullWidth
                size="small"
                variant="contained"
                startIcon={
                  <Iconify icon="eva:navigation-2-fill" width={16} />
                }
                onClick={() => setMapsDialogOpen(true)}
              >
                {t('Open in maps')}
              </Button>
            </Box>
          </ControlsBox>
        )}
      </StyledRoot>

      <Dialog
        open={mapsDialogOpen}
        onClose={() => setMapsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('Open location in')}</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="simple-icons:waze" width={20} />}
              onClick={() => openExternalMap('waze')}
            >
              {t('Waze')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mdi:google-maps" width={20} />}
              onClick={() => openExternalMap('google')}
            >
              {t('Google Maps')}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setMapsDialogOpen(false)}>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
