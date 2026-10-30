import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
}));

const MapPicker = dynamic(() => import('@/components/map/map-picker'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{ width: '100%', height: 560, bgcolor: '#e5e3df', borderRadius: 2 }}
    />
  ),
});

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
  // contacts latlng: [lat, lng] → MapPicker expects [lng, lat]
  const markers = contacts
    .filter((c) => c.latlng?.length >= 2)
    .map((c) => [c.latlng[1], c.latlng[0]] as [number, number]);

  const center = markers[0] ?? ([-84.0907, 9.9281] as [number, number]);

  return (
    <StyledRoot>
      <MapPicker center={center} markers={markers} height={560} zoom={8} />
    </StyledRoot>
  );
}
