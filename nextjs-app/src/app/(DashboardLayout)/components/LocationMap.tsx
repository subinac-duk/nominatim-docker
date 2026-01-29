"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { defaultIcon } from "@/lib/leafletIcon";

type Props = {
  onLocationChange?: (data: {
    lat: number;
    lon: number;
    address: string;
  }) => void;
};

export default function LocationMap({ onLocationChange }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  // 📍 get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
        fetchAddress(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // fallback: India center
        setPosition([20.5937, 78.9629]);
      }
    );
  }, []);

  // 🔁 reverse geocode
  const fetchAddress = async (lat: number, lon: number) => {
    const res = await fetch(
      `/api/reverse-geocode?lat=${lat}&lon=${lon}`
    );
    const data = await res.json();

    onLocationChange?.({
      lat,
      lon,
      address: data.display_name,
    });
  };

  // 🖱️ click handler
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    return position ? (
      <Marker position={position} icon={defaultIcon} />
    ) : null;
  }

  if (!position) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
