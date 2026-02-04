'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from './LeafletMap';
import GeoJsonLayer from './GeoJsonLayer';
import MapClickHandler from './MapClickHandler';

import villages from '@/data/villages.json';
import { findContainingFeature } from '@/lib/geo/pointInPolygon';
import {
  getVillageName,
  getDistrictName,
  getTalukName,
  getStateName,
} from '@/lib/geo/getLocationNames';

import { defaultIcon } from '@/lib/leafletIcon';

export default function LocationMap({ lat, lon }: any) {
  // local state
  const [point, setPoint] = useState({ lat, lon });

  const village = findContainingFeature(
    point.lat,
    point.lon,
    villages
  );

  const labelParts = [
    getVillageName(village?.properties),
    getTalukName(village?.properties),
    getDistrictName(village?.properties),
    getStateName(village?.properties),
  ];

  const label = labelParts.filter(Boolean).join(', ');

  return (
    <>
      <MapContainer
        center={[point.lat, point.lon]}
        zoom={14}
        style={{ height: 400, width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


        <MapClickHandler onSelect={setPoint} />

        {/* 📍 marker */}
        <Marker
          position={[point.lat, point.lon]}
          icon={defaultIcon}
        >
          
        </Marker>

        <GeoJsonLayer
          feature={villages}
          style={{
            fillColor: 'blue',
            fillOpacity: 0.1,
            color: 'blue',
            weight: 1,
          }}
        />
      </MapContainer>
      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}>
          📍 {label || 'Selected location'}
        </div>

        <a
          href={`https://www.google.com/maps?q=${point.lat},${point.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            color: '#1a73e8',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          🔍 Google Map
        </a>
      </div>
    </>

  );
}
