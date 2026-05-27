import Map, { MapRef } from 'react-map-gl';
import { memo, useRef, useState, useCallback } from 'react';

import { MapControl, MapBoxProps } from '@/components/map';

import ControlPanel, { CityProps } from './control-panel';

// ----------------------------------------------------------------------

interface Props extends MapBoxProps {
  data: CityProps[];
}

function MapViewportAnimation({ data, ...other }: Props) {
  const mapRef = useRef<MapRef>(null);

  const [selectedCity, setSelectedCity] = useState(data[2].city);

  const {
    projection: _projection,
    logoPosition: _logoPosition,
    ...mapProps
  } = other;

  const onSelectCity = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      { longitude, latitude }: { longitude: number; latitude: number }
    ) => {
      setSelectedCity(event.target.value);
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
    },
    []
  );

  return (
    <Map
      initialViewState={{
        latitude: 37.7751,
        longitude: -122.4193,
        zoom: 11,
        bearing: 0,
        pitch: 0,
      }}
      ref={mapRef}
      {...mapProps}
    >
      <MapControl />

      <ControlPanel
        data={data}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />
    </Map>
  );
}

export default memo(MapViewportAnimation);
