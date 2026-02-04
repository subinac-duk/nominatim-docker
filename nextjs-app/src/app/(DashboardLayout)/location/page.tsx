'use client';

import { useState } from 'react';
import LocationModal from '@/app/(DashboardLayout)/components/geojson/LocationModal';

export default function Page() {
  const [coords, setCoords] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setOpen(true);
      },
      (err) => alert(err.message),
      { enableHighAccuracy: true }
    );
  };

  return (
    <>
      <button onClick={getLocation}>Show my location</button>

      {coords && (
        <LocationModal
          open={open}
          onClose={() => setOpen(false)}
          coords={coords}
        />
      )}

      
    </>
  );
}
