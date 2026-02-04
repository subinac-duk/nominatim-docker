"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { startIcon, endIcon } from "@/lib/leafletIcon";
import GpsTracker from "@/app/(DashboardLayout)/components/mapcomponents/GpsTracker";

import { Polyline } from "react-leaflet";
import { useOsrmRoute } from "@/hooks/useOsrmRoute";


type Props = {
  onLocationChange?: (data: {
    lat: number;
    lon: number;
    address: string;
  }) => void;
};

function FitRoute({ route }: { route: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route]);

  return null;
}




export default function LocationMap({ onLocationChange }: Props) {


  const {
    path: route,
    distanceKm,
    durationMin,
    loading,
    error,
    fetchRoute,
    clearRoute,
  } = useOsrmRoute();

  const [position, setPosition] = useState<[number, number] | null>(null);

  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  const [tracking] = useState(true);


  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const clicked: [number, number] = [
          e.latlng.lat,
          e.latlng.lng,
        ];

        setEnd(clicked);
        setPosition(clicked);
        fetchAddress(clicked[0], clicked[1]);

        if (start) {
          clearRoute();
          fetchRoute(start, clicked);
        }
      },
    });

    return null;
  }


  // 📍 get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition([lat, lon]);
        setStart([lat, lon]);
        fetchAddress(lat, lon);

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

    /*const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "your-app-name/1.0 (your@email.com)",
        },
      }
    );*/

    const data = await res.json();
    onLocationChange?.({
      lat,
      lon,
      address: data.display_name,
    });
  };



  if (!position) return <p>Loading map...</p>;

  return (
    <>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🟢 Start Marker */}
        {start && (
          <Marker
            position={start}
            icon={startIcon}
          />
        )}

        {/* 🔴 End Marker */}
        {end && (
          <Marker
            position={end}
            icon={endIcon}
          />
        )}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "blue", weight: 4 }}
          />
        )}
        <MapClickHandler />
        {distanceKm && durationMin && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "white",
              padding: "8px 12px",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              zIndex: 1000,
              fontSize: 14,
            }}
          >
            📏 {distanceKm} km<br />
            ⏱ {durationMin} min
          </div>
        )}

        <FitRoute route={route} />
        <GpsTracker
          tracking={tracking}
          route={route}
          iconUrl="/gps-dot.svg" 
          iconSize={24} 
          smoothSteps={20}
          snapToRoute
          onPositionChange={(p) => setPosition(p)}
        />


      </MapContainer>

    </>
  );
}
