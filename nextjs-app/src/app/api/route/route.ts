import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startLat = searchParams.get("startLat");
  const startLon = searchParams.get("startLon");
  const endLat = searchParams.get("endLat");
  const endLon = searchParams.get("endLon");

  if (!startLat || !startLon || !endLat || !endLon) {
    return NextResponse.json(
      { error: "Missing coordinates" },
      { status: 400 }
    );
  }

 // const OSRM_URL = 'http://osrm:5000';


 const OSRM_URL = 'https://router.project-osrm.org';

  if (!OSRM_URL) {
    return NextResponse.json(
      { error: "OSRM_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const osrmRes = await fetch(
      `${OSRM_URL}/route/v1/driving/` +
        `${startLon},${startLat};${endLon},${endLat}` +
        `?overview=full&geometries=geojson`
    );

    if (!osrmRes.ok) {
      throw new Error("OSRM request failed");
    }

    const data = await osrmRes.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Routing failed" },
      { status: 500 }
    );
  }
}
