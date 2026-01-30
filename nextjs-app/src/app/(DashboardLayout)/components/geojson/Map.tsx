'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from './LeafletMap';
import GeoJsonLayer from './GeoJsonLayer';

import states from '@/data/states.json';
import districts from '@/data/districts.json';
import villages from '@/data/villages.json';


import { findContainingFeature } from '@/lib/geo/pointInPolygon';
import {
  getVillageName,
  getTalukName,
  getDistrictName,
  getStateName,
} from '@/lib/geo/getLocationNames';

export default function LocationMap({ lat, lon }: any) {
  // 🔽 smallest → largest
  const village = findContainingFeature(lat, lon, villages);
  const district = findContainingFeature(lat, lon, districts);
  const state = findContainingFeature(lat, lon, states);

console.log({
  village: village?.properties,
  district: district?.properties,
  state: state?.properties,
});

  const labelParts = [
  getVillageName(village?.properties),
  getDistrictName(district?.properties),
  getStateName(state?.properties),
];

const label = labelParts.filter(Boolean).join(', ');

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={14}
      style={{ height: 400, width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[lat, lon]}>
        <Tooltip permanent direction="top" offset={[0, -10]}>
          📍 {label || 'Your location'}
        </Tooltip>
      </Marker>

      {/* Highlight only the most specific boundary */}
      <GeoJsonLayer feature={village || taluk || district} />
    </MapContainer>
  );
}
