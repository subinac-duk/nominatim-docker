import * as turf from '@turf/turf';

export function findContainingFeature(
  lat: number,
  lon: number,
  geojson: any
) {
  const point = turf.point([lon, lat]);

  for (const feature of geojson.features) {
    try {
      if (turf.booleanPointInPolygon(point, feature)) {
        return feature;
      }
    } catch {
      // skip invalid geometry
    }
  }

  return null;
}
