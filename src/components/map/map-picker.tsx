'use client';

import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Map as MLMap,
  Marker,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  config as maplibreConfig,
} from 'maplibre-gl';

type Props = {
  center?: [number, number];
  zoom?: number;
  marker?: [number, number] | null;
  onPickAction?: (coords: [number, number]) => void;
  height?: number;
};

export default function MapPicker({
  center = [-84.09, 9.93],
  zoom = 12,
  marker,
  onPickAction,
  height = 400,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // maplibre-gl v6 ships only ESM workers — point to the bundled worker file
    maplibreConfig.WORKER_URL = '/maplibre-gl-worker.mjs';

    const map = new MLMap({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center,
      zoom,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new ScaleControl({ maxWidth: 100, unit: 'metric' }),
      'bottom-left'
    );
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      'top-right'
    );

    map.on('load', () => {
      map.resize();
    });

    map.on('styleimagemissing', (e) => {
      map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
    });

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onPickAction?.([lng, lat]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (marker) {
      markerRef.current = new Marker({
        color: '#FF6B35',
        draggable: true,
      })
        .setLngLat(marker)
        .addTo(map);

      markerRef.current.on('dragend', () => {
        const lngLat = markerRef.current?.getLngLat();
        if (lngLat) {
          onPickAction?.([lngLat.lng, lngLat.lat]);
        }
      });

      map.flyTo({
        center: marker,
        zoom: Math.max(map.getZoom(), 14),
        duration: 800,
      });
    }
  }, [marker, onPickAction]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#e5e3df',
      }}
    />
  );
}
