"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";

type MapPin = {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  tone: "gold" | "forest" | "clay";
  kind: string;
  summary: string;
};

type OsmMapProps = {
  pins: MapPin[];
  activePin: string | null;
  onPinSelect: (pinId: string | null) => void;
};

const toneColors = {
  gold: "#D2A66D",
  forest: "#6D8B7D",
  clay: "#C17B58"
} as const;

function createPinIcon(tone: MapPin["tone"], active: boolean) {
  const color = toneColors[tone];
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: ${active ? 22 : 16}px;
        height: ${active ? 22 : 16}px;
        border-radius: 9999px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 22px ${color}cc;
      ">
        <div style="
          position: absolute;
          inset: -10px;
          border-radius: 9999px;
          background: ${color}33;
          opacity: ${active ? 0.85 : 0.5};
          animation: pulse-ring 2.8s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [active ? 22 : 16, active ? 22 : 16],
    iconAnchor: [active ? 11 : 8, active ? 11 : 8],
    popupAnchor: [0, -(active ? 11 : 8)]
  });
}

export function OSMMap({ pins, activePin, onPinSelect }: OsmMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const center = useMemo<[number, number]>(() => {
    if (pins[0]) return [pins[0].latitude, pins[0].longitude];
    return [6.5244, 3.3792];
  }, [pins]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true
    }).setView(center, 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      markersRef.current = null;
      mapRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    pins.forEach((pin) => {
      bounds.push([pin.latitude, pin.longitude]);
      const marker = L.marker([pin.latitude, pin.longitude], {
        icon: createPinIcon(pin.tone, activePin === pin.id)
      });

      marker.bindPopup(
        `
          <div style="min-width: 180px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.32em; color: #D2A66D; margin-bottom: 6px;">${pin.kind}</div>
            <div style="font-size: 14px; font-weight: 600; color: #F6F1E8; margin-bottom: 2px;">${pin.title}</div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; color: #8E877E; margin-bottom: 8px;">${pin.location}</div>
            <div style="font-size: 12px; line-height: 1.55; color: #CFC7BC;">${pin.summary}</div>
          </div>
        `,
        { closeButton: false, className: "afrika-leaflet-popup" }
      );

      marker.on("click", () => {
        onPinSelect(activePin === pin.id ? null : pin.id);
      });

      marker.addTo(layer);
      if (activePin === pin.id) {
        marker.openPopup();
      }
    });

    if (bounds.length > 0) {
      const fitBounds = L.latLngBounds(bounds);
      map.fitBounds(fitBounds.pad(0.2), { animate: true, duration: 0.8 });
    }
  }, [activePin, onPinSelect, pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    requestAnimationFrame(() => map.invalidateSize());
  }, [pins]);

  return <div ref={mapNodeRef} className="h-full w-full" style={{ minHeight: 680 }} />;
}
