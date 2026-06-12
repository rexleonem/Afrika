export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");

function joinUrl(path: string) {
  if (!API_BASE_URL.trim()) return `/${path.replace(/^\//, "")}`;
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function readAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("afrika_session_token");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const authToken = readAuthToken();
  const response = await fetch(joinUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
