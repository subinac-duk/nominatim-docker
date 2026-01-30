'use client';

import dynamic from 'next/dynamic';

const GeoJSON = dynamic(
  () => import('react-leaflet').then((m) => m.GeoJSON),
  { ssr: false }
);

export default function GeoJsonLayer({ feature }: any) {
  if (!feature) return null;

  return (
    <GeoJSON
      data={feature}
      style={{
        color: '#1976d2',
        weight: 2,
        fillOpacity: 0.05,
      }}
    />
  );
}
