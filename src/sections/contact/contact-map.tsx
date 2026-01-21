import Map from 'react-map-gl';
import { useState } from 'react';

import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { MAPBOX_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { MapPopup, MapMarker, MapControl } from 'src/components/map';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

type CountryData = {
  latlng: number[];
  address: string;
  phoneNumber: string;
};

type Props = {
  contacts: CountryData[];
};

export default function ContactMap({ contacts }: Props) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === 'light';

  const [popupInfo, setPopupInfo] = useState<CountryData | null>(null);

  const [contactsMap, setContactsMap] = useState<CountryData[]>(contacts);

  const marker = (e: any) => {
    // For regular map clicks, use lngLat to get coordinates
    if (e.lngLat) {
      const { lng, lat } = e.lngLat;
      // You can handle map click coordinates here if needed
      console.log('Map clicked at:', lat, lng);
      setContactsMap((prevContacts) => [
        ...prevContacts,
        {
          latlng: [lat, lng],
          address: `New Address at (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          phoneNumber: 'New Phone Number',
        },
      ]);
    }
  };

  return (
    <StyledRoot>
      <Map
        initialViewState={{
          latitude: 9.9281, // San José
          longitude: -84.0907,
          zoom: 8, // Zoom adecuado para ver todo el país
        }}
        mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
        mapboxAccessToken={MAPBOX_API}
        onClick={marker}
      >
        <MapControl hideGeolocateControl />

        {contactsMap.map((country, index) => (
          <MapMarker
            key={`marker-${index}`}
            latitude={country.latlng[0]}
            longitude={country.latlng[1]}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setPopupInfo(country);
            }}
          />
        ))}

        {popupInfo && (
          <MapPopup
            longitude={popupInfo.latlng[1]}
            latitude={popupInfo.latlng[0]}
            onClose={() => setPopupInfo(null)}
            sx={{
              '& .mapboxgl-popup-content': { bgcolor: 'background.paper' },
              '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
                borderTopColor: '#FFF',
              },
              '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
                borderBottomColor: '#FFF',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Address
            </Typography>

            <Typography component="div" variant="caption">
              {popupInfo.address}
            </Typography>

            <Typography
              component="div"
              variant="caption"
              sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
            >
              <Iconify icon="solar:phone-bold" width={14} sx={{ mr: 0.5 }} />
              {popupInfo.phoneNumber}
            </Typography>
          </MapPopup>
        )}
      </Map>
    </StyledRoot>
  );
}

// import Map from 'react-map-gl';
// import { useState } from 'react';
// import Iconify from '@/src/components/iconify';

// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import { styled, useTheme } from '@mui/material/styles';

// import { MAPBOX_API } from 'src/config-global';

// import { MapPopup, MapMarker, MapControl } from 'src/components/map';

// // ----------------------------------------------------------------------

// const StyledRoot = styled('div')(({ theme }) => ({
//   zIndex: 0,
//   height: 560,
//   overflow: 'hidden',
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
//     display: 'none',
//   },
// }));

// const CoordinatesBox = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   bottom: theme.spacing(2),
//   left: theme.spacing(2),
//   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   padding: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
//   maxWidth: 300,
//   zIndex: 1,
// }));

// type CountryData = {
//   latlng: number[];
//   address: string;
//   phoneNumber: string;
// };

// type Props = {
//   contacts: CountryData[];
// };

// export default function ContactMap({ contacts }: Props) {
//   const theme = useTheme();
//   const lightMode = theme.palette.mode === 'light';
//   const [popupInfo, setPopupInfo] = useState<CountryData | null>(null);
//   // Estado para almacenar las coordenadas del click
//   const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
//     null
//   );
//   // Estado para el marcador temporal
//   const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);

//   const handleMapClick = (event: any) => {
//     // Obtener coordenadas del click
//     const { lng, lat } = event.lngLat;
//     const coordinates: [number, number] = [lat, lng];

//     console.log('Coordenadas click:', coordinates);

//     // Guardar coordenadas
//     setClickedCoords(coordinates);
//     // Crear marcador temporal
//     setTempMarker(coordinates);

//     // También puedes copiar al portapapeles automáticamente
//     const coordsText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//     navigator.clipboard.writeText(coordsText).then(() => {
//       console.log('Coordenadas copiadas:', coordsText);
//     });
//   };

//   const clearTempMarker = () => {
//     setTempMarker(null);
//     setClickedCoords(null);
//   };

//   return (
//     <StyledRoot>
//       <Map
//         initialViewState={{
//           latitude: 9.9281,
//           longitude: -84.0907,
//           zoom: 8,
//         }}
//         mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
//         mapboxAccessToken={MAPBOX_API}
//         onClick={handleMapClick} // ← AQUÍ ESTÁ EL EVENTO
//         cursor="crosshair"
//       >
//         <MapControl hideGeolocateControl />

//         {/* Marcadores existentes */}
//         {contacts.map((country, index) => (
//           <MapMarker
//             key={`marker-${index}`}
//             latitude={country.latlng[0]}
//             longitude={country.latlng[1]}
//             onClick={(event) => {
//               event.originalEvent.stopPropagation();
//               setPopupInfo(country);
//             }}
//           />
//         ))}

//         {/* Marcador temporal del click */}
//         {tempMarker && (
//           <MapMarker
//             latitude={tempMarker[0]}
//             longitude={tempMarker[1]}
//             color="#FF0000" // Rojo para distinguirlo
//           />
//         )}
//       </Map>

//       {popupInfo && (
//         <MapPopup
//           longitude={popupInfo.latlng[1]}
//           latitude={popupInfo.latlng[0]}
//           onClose={() => setPopupInfo(null)}
//           sx={{
//             '& .mapboxgl-popup-content': { bgcolor: 'background.paper' },
//             '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
//               borderTopColor: '#FFF',
//             },
//             '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
//               borderBottomColor: '#FFF',
//             },
//           }}
//         >
//           <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
//             Address
//           </Typography>

//           <Typography component="div" variant="caption">
//             {popupInfo.address}
//           </Typography>

//           <Typography
//             component="div"
//             variant="caption"
//             sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
//           >
//             <Iconify icon="solar:phone-bold" width={14} sx={{ mr: 0.5 }} />
//             {popupInfo.phoneNumber}
//           </Typography>
//         </MapPopup>
//       )}

//       {/* Mostrar coordenadas del último click */}
//       {clickedCoords && (
//         <CoordinatesBox>
//           <Typography variant="subtitle2" gutterBottom>
//             📍 Coordenadas del click:
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
//             Latitud: {clickedCoords[0].toFixed(6)}
//             <br />
//             Longitud: {clickedCoords[1].toFixed(6)}
//           </Typography>
//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{ mb: 2, display: 'block' }}
//           >
//             Haz click en cualquier parte del mapa para obtener nuevas
//             coordenadas
//           </Typography>
//           <Button size="small" variant="outlined" onClick={clearTempMarker}>
//             Limpiar marcador
//           </Button>
//         </CoordinatesBox>
//       )}
//     </StyledRoot>
//   );
// }
