function decodeHeaderValue(value: string | null) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function parseCoordinate(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const city = decodeHeaderValue(request.headers.get("x-vercel-ip-city"));
  const region = decodeHeaderValue(request.headers.get("x-vercel-ip-country-region"));
  const country = decodeHeaderValue(request.headers.get("x-vercel-ip-country"));
  const timezone = decodeHeaderValue(request.headers.get("x-vercel-ip-timezone"));
  const latitude = parseCoordinate(request.headers.get("x-vercel-ip-latitude"));
  const longitude = parseCoordinate(request.headers.get("x-vercel-ip-longitude"));

  const source = latitude !== undefined && longitude !== undefined ? "ip" : city || country ? "city" : "none";

  return new Response(
    JSON.stringify({
      source,
      city,
      region,
      country,
      timezone,
      latitude,
      longitude
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
