// components/dashboard/user/pet-location-map.tsx
import Map from 'react-map-gl';
import Iconify from '@/components/iconify';
import { MAPBOX_API } from '@/config-global';
import { useState, useCallback } from 'react';
import { MapMarker, MapControl } from '@/components/map';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 500,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

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
  const lightMode = theme.palette.mode === 'light';

  const [viewState, setViewState] = useState({
    latitude: initialLocation?.lat ? parseFloat(initialLocation.lat) : 9.9281,
    longitude: initialLocation?.lng
      ? parseFloat(initialLocation.lng)
      : -84.0907,
    zoom: 15,
  });

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation?.lat && initialLocation?.lng
      ? [parseFloat(initialLocation.lat), parseFloat(initialLocation.lng)]
      : null
  );

  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Geocoding: buscar dirección y obtener coordenadas
  const searchLocation = useCallback(async () => {
    if (!searchAddress.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter an address',
        severity: 'error',
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchAddress
        )}.json?access_token=${MAPBOX_API}&country=cr&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const formattedAddress = data.features[0].place_name;

        setViewState({
          latitude,
          longitude,
          zoom: 15,
        });
        setMarkerPosition([latitude, longitude]);
        setAddress(formattedAddress);

        onLocationChange({
          lat: latitude.toString(),
          lng: longitude.toString(),
          address: formattedAddress,
        });

        setSnackbar({
          open: true,
          message: 'Location found!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Address not found',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSnackbar({
        open: true,
        message: 'Error searching location',
        severity: 'error',
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchAddress, onLocationChange]);

  // Obtener dirección a partir de coordenadas (reverse geocoding)
  const getAddressFromCoords = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_API}&country=cr&limit=1`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const formattedAddress = data.features[0].place_name;
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
    async (event: any) => {
      if (readOnly) return;

      const { lng, lat } = event.lngLat;
      const coordinates: [number, number] = [lat, lng];

      setMarkerPosition(coordinates);
      setViewState((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      // Obtener dirección de las coordenadas
      const formattedAddress = await getAddressFromCoords(lat, lng);

      if (formattedAddress) {
        setAddress(formattedAddress);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        onLocationChange({
          lat: lat.toString(),
          lng: lng.toString(),
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      }

      setSnackbar({
        open: true,
        message: 'Location saved!',
        severity: 'success',
      });
    },
    [readOnly, getAddressFromCoords, onLocationChange]
  );

  // Usar ubicación actual del dispositivo
  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSnackbar({
        open: true,
        message: 'Geolocation not supported',
        severity: 'error',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setViewState({
          latitude,
          longitude,
          zoom: 5,
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

        setSnackbar({
          open: true,
          message: 'Current location set!',
          severity: 'success',
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setSnackbar({
          open: true,
          message: 'Error getting location',
          severity: 'error',
        });
      }
    );
  }, [getAddressFromCoords, onLocationChange]);

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
    setSnackbar({
      open: true,
      message: 'Location cleared',
      severity: 'success',
    });
  }, [onLocationChange]);

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledRoot>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={`mapbox://styles/mapbox/${
            lightMode ? 'light' : 'dark'
          }-v10`}
          mapboxAccessToken={MAPBOX_API}
          onClick={handleMapClick}
          cursor={readOnly ? 'default' : 'crosshair'}
          interactive={!readOnly}
        >
          <MapControl hideGeolocateControl />

          {markerPosition && (
            <MapMarker
              latitude={markerPosition[0]}
              longitude={markerPosition[1]}
              color={readOnly ? '#666' : '#FF6B6B'}
              draggable={!readOnly}
              onDragEnd={(event) => {
                const { lngLat } = event;
                const newLat = lngLat.lat;
                const newLng = lngLat.lng;
                setMarkerPosition([newLat, newLng]);
                getAddressFromCoords(newLat, newLng);
                onLocationChange({
                  lat: newLat.toString(),
                  lng: newLng.toString(),
                  address,
                });
              }}
            />
          )}
        </Map>

        {!readOnly && (
          <>
            <SearchBox>
              <TextField
                fullWidth
                size="small"
                placeholder="Search address..."
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
                Pet Location
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
                  Click on the map or search to set your pet&apos;s location
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
                  Search
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="eva:pin-fill" width={16} />}
                  onClick={useCurrentLocation}
                >
                  My Location
                </Button>
                {markerPosition && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-fill" width={16} />}
                    onClick={clearLocation}
                  >
                    Clear
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
              Pet Location
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
          </ControlsBox>
        )}
      </StyledRoot>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
