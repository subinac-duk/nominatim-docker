import * as turf from '@turf/turf';

export function findVillage(
  lat: number,
  lon: number,
  geojson: any
) {
  const point = turf.point([lon, lat]);

  for (const feature of geojson.features) {
    // safety check
    if (!feature.geometry) continue;

    if (turf.booleanPointInPolygon(point, feature)) {
      return feature;
    }
  }

  return null;
}
