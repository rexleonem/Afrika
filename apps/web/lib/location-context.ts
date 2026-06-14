"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type IPLocation = {
  source: "ip" | "city" | "none";
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
};

type GPSLocation = {
  source: "gps";
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export type EffectiveLocation = {
  source: "gps" | "ip" | "city" | "none";
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  label?: string;
};

type GeolocationStatus = "idle" | "granted" | "prompt" | "denied" | "unsupported" | "loading";

const STORAGE_KEY = "afrika_exact_location";

function readStoredGPS() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GPSLocation;
    if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function persistGPS(location: GPSLocation | null) {
  if (typeof window === "undefined") return;
  if (!location) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
}

function buildLocationLabel(location: { city?: string; region?: string; country?: string }) {
  return [location.city, location.region, location.country].filter(Boolean).join(", ");
}

export function buildLocationQuery(location: EffectiveLocation | null) {
  if (!location || location.source === "none") return "";

  const params = new URLSearchParams();
  if (location.latitude !== undefined) params.set("lat", location.latitude.toString());
  if (location.longitude !== undefined) params.set("lng", location.longitude.toString());
  if (location.city) params.set("city", location.city);
  if (location.region) params.set("region", location.region);
  if (location.country) params.set("country", location.country);
  return params.toString();
}

export function useLocationContext() {
  const [ipLocation, setIpLocation] = useState<IPLocation | null>(null);
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>("idle");

  useEffect(() => {
    const stored = readStoredGPS();
    if (stored) {
      setGpsLocation(stored);
      setGeolocationStatus("granted");
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/location-context", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: IPLocation) => {
        if (!active) return;
        setIpLocation(payload);
      })
      .catch(() => {
        if (!active) return;
        setIpLocation({ source: "none" });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("navigator" in window) || !("geolocation" in navigator)) {
      setGeolocationStatus((current) => (current === "granted" ? current : "unsupported"));
      return;
    }

    if (!("permissions" in navigator) || typeof navigator.permissions.query !== "function") {
      setGeolocationStatus((current) => (current === "granted" ? current : "prompt"));
      return;
    }

    let active = true;
    void navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permissionStatus) => {
        if (!active) return;
        if (permissionStatus.state === "granted") {
          setGeolocationStatus("granted");
          return;
        }
        if (permissionStatus.state === "denied") {
          setGeolocationStatus("denied");
          return;
        }
        setGeolocationStatus("prompt");
      })
      .catch(() => {
        if (!active) return;
        setGeolocationStatus((current) => (current === "granted" ? current : "prompt"));
      });

    return () => {
      active = false;
    };
  }, []);

  const requestPreciseLocation = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeolocationStatus("unsupported");
      return null;
    }

    setGeolocationStatus("loading");

    return new Promise<GPSLocation | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextLocation: GPSLocation = {
            source: "gps",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          setGpsLocation(nextLocation);
          setGeolocationStatus("granted");
          persistGPS(nextLocation);
          resolve(nextLocation);
        },
        () => {
          setGeolocationStatus("denied");
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000 * 60 * 10,
          timeout: 10000
        }
      );
    });
  }, []);

  useEffect(() => {
    if (geolocationStatus !== "granted" || gpsLocation) return;
    void requestPreciseLocation();
  }, [geolocationStatus, gpsLocation, requestPreciseLocation]);

  const effectiveLocation = useMemo<EffectiveLocation | null>(() => {
    if (gpsLocation) {
      return {
        source: "gps",
        city: ipLocation?.city,
        region: ipLocation?.region,
        country: ipLocation?.country,
        timezone: ipLocation?.timezone,
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        accuracy: gpsLocation.accuracy,
        label: buildLocationLabel(ipLocation ?? {})
      };
    }

    if (ipLocation) {
      return {
        source: ipLocation.source,
        city: ipLocation.city,
        region: ipLocation.region,
        country: ipLocation.country,
        timezone: ipLocation.timezone,
        latitude: ipLocation.latitude,
        longitude: ipLocation.longitude,
        label: buildLocationLabel(ipLocation)
      };
    }

    return null;
  }, [gpsLocation, ipLocation]);

  return {
    ipLocation,
    gpsLocation,
    effectiveLocation,
    geolocationStatus,
    requestPreciseLocation,
    isLocating: geolocationStatus === "loading"
  };
}
