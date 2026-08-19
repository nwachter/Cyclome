import { NextResponse } from "next/server";

const BAN_URL = "https://api-adresse.data.gouv.fr/search/";

// Proxy Base Adresse Nationale
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";

  if (query.trim().length < 3) {
    return NextResponse.json([]);
  }

  const response = await fetch(
    `${BAN_URL}?q=${encodeURIComponent(query)}&limit=5&type=housenumber`,
  );

  if (!response.ok) {
    return NextResponse.json({ message: "Service d'adresses indisponible" }, { status: 502 });
  }

  const data = await response.json();

  const suggestions = (data.features ?? []).map(
    (feature: {
      properties: { label: string; name: string; postcode: string; city: string };
      geometry: { coordinates: [number, number] };
    }) => ({
      label: feature.properties.label,
      street: feature.properties.name,
      postalCode: feature.properties.postcode,
      city: feature.properties.city,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    }),
  );

  return NextResponse.json(suggestions);
}
