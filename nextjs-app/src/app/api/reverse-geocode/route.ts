import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `http://nominatim:8080/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  );

 /* const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  );*/

  const data = await response.json();
  return NextResponse.json(data);
}
