"use client";

import { useEffect, useState } from "react";

export function useRoute(start, end) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
  if (!start || !end) return;

  const fetchRoute = async () => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();

    const route = data.routes[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );

    setRoute(route);
  };

  fetchRoute();
}, [start, end]);

  return route;
}
