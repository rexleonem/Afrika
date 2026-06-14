const backendOrigin =
  process.env.API_PUBLIC_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://afrika.techculture.live";

type QueryValue = string | number | boolean | null | undefined;

type ServerApiInit = RequestInit & {
  query?: Record<string, QueryValue>;
};

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path.replace(/^\//, ""), `${backendOrigin.replace(/\/$/, "")}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function serverApiFetch<T>(path: string, init?: ServerApiInit): Promise<T> {
  const { query, headers, ...rest } = init ?? {};
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error ?? `Server request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
