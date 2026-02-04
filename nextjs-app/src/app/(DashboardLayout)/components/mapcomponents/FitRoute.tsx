import { useMap } from "react-leaflet";

function FitRoute({ route }: { route: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route]);

  return null;
}
