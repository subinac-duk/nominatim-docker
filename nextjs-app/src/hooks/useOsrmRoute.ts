"use client";

import { useCallback, useState } from "react";

type LatLng = [number, number];

type RouteResult = {
  path: LatLng[];
  distanceKm: number | null;
  durationMin: number | null;
  loading: boolean;
  error: string | null;
};

export function useOsrmRoute() {
  const [path, setPath] = useState<LatLng[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(
    async (start: LatLng, end: LatLng) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/route?` +
            `startLat=${start[0]}&startLon=${start[1]}` +
            `&endLat=${end[0]}&endLon=${end[1]}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Routing failed");
        }

        const data = await res.json();
        const route = data.routes[0];

        const leafletCoords: LatLng[] =
          route.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          );

        setPath(leafletCoords);
        setDistanceKm(Number((route.distance / 1000).toFixed(2)));
        setDurationMin(Math.round(route.duration / 60));
      } catch (err: any) {
        setError(err.message ?? "Unknown routing error");
        setPath([]);
        setDistanceKm(null);
        setDurationMin(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearRoute = useCallback(() => {
    setPath([]);
    setDistanceKm(null);
    setDurationMin(null);
    setError(null);
  }, []);

  return {
    path,
    distanceKm,
    durationMin,
    loading,
    error,
    fetchRoute,
    clearRoute,
  } satisfies RouteResult & {
    fetchRoute: (start: LatLng, end: LatLng) => Promise<void>;
    clearRoute: () => void;
  };
}
