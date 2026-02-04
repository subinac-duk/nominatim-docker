"use client";

import { Marker } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

type LatLng = [number, number];

type Props = {
  tracking: boolean;
  route?: LatLng[];
  iconUrl: string;
  iconSize?: number;
  snapToRoute?: boolean;
  smoothSteps?: number;
  onPositionChange?: (pos: LatLng) => void;
};

export default function GpsTracker({
  tracking,
  route = [],
  iconUrl,
  iconSize = 24,
  snapToRoute = true,
  smoothSteps = 20,
  onPositionChange,
}: Props) {
  const [position, setPosition] = useState<LatLng | null>(null);

  const prevPos = useRef<LatLng | null>(null);
  const watchId = useRef<number | null>(null);

 
  const icon = useMemo(
    () => createIcon(iconUrl, iconSize),
    [iconUrl, iconSize]
  );

  useEffect(() => {
    if (!tracking) {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next: LatLng = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        if (!prevPos.current) {
          prevPos.current = next;
          setPosition(next);
          onPositionChange?.(next);
          return;
        }

        let target = next;

        if (snapToRoute && route.length > 0) {
          target = findNearestPoint(route, next);
        }

        smoothMove(prevPos.current, target, smoothSteps, (p) => {
          setPosition(p);
          onPositionChange?.(p);
        });

        prevPos.current = target;
      },
      console.error,
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [tracking, route, snapToRoute, smoothSteps]);

  if (!position) return null;

  return <Marker position={position} icon={icon} />;
}



function createIcon(url: string, size: number) {
  return L.icon({
    iconUrl: url,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function smoothMove(
  from: LatLng,
  to: LatLng,
  steps: number,
  cb: (p: LatLng) => void
) {
  let i = 0;

  function step() {
    i++;
    const t = i / steps;
    cb([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
    ]);
    if (i < steps) requestAnimationFrame(step);
  }

  step();
}

function findNearestPoint(route: LatLng[], p: LatLng): LatLng {
  let min = Infinity;
  let closest = route[0];

  for (const r of route) {
    const d =
      (r[0] - p[0]) ** 2 +
      (r[1] - p[1]) ** 2;

    if (d < min) {
      min = d;
      closest = r;
    }
  }

  return closest;
}
