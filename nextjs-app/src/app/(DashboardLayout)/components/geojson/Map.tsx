'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from './LeafletMap';
import GeoJsonLayer from './GeoJsonLayer';

import states from '@/data/states.json';
import districts from '@/data/districts.json';
import villages from '@/data/villages.json';

import MapClickHandler from './MapClickHandler';

import { findContainingFeature } from '@/lib/geo/pointInPolygon';
import {
  getVillageName,
  getDistrictName,
  getStateName,
} from '@/lib/geo/getLocationNames';

export default function LocationMap({ lat, lon }: any) {
  // 🔽 NEW: local state (initially GPS location)
  const [point, setPoint] = useState({ lat, lon });

  // 🔽 use selected point instead of props
  const village = findContainingFeature(point.lat, point.lon, villages);
  const district = findContainingFeature(point.lat, point.lon, districts);
  const state = findContainingFeature(point.lat, point.lon, states);

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
      center={[point.lat, point.lon]}
      zoom={14}
      style={{ height: 400, width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapClickHandler onSelect={setPoint} />

      {/* 📍 marker follows clicked location */}
      <Marker position={[point.lat, point.lon]}>
        <Tooltip permanent direction="top" offset={[0, -10]}>
          📍 {label || 'Selected location'}
        </Tooltip>
      </Marker>

      {/* Highlight most specific boundary */}
      <GeoJsonLayer feature={village || district || state} />
    </MapContainer>
  );
}
