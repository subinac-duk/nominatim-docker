'use client';

import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onSelect }: any) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lon: lng });
    },
  });

  return null;
}
