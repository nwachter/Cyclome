"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import type { ZoneListItem } from "@/server/zones";
import type { PolygonInput } from "@/lib/validation/zone";

const LYON_CENTER: [number, number] = [45.758, 4.835];
//Leaflet attend l'inverse de GeoJson
function toLeafletPositions(boundary: PolygonInput): [number, number][] {
  const ring = boundary.coordinates[0] ?? [];
  return ring.map(([lng, lat]) => [lat, lng]);
}

function toGeoJsonPolygon(layer: L.Polygon): PolygonInput {
  const latLngs = layer.getLatLngs()[0] as L.LatLng[];
  const ring = latLngs.map((point) => [point.lng, point.lat] as [number, number]);
  const first = ring[0];
  if (first) ring.push([first[0], first[1]]);
  return { type: "Polygon", coordinates: [ring] };
}

type DrawingProps = {
  isDrawing: boolean;
  onShapeDrawn: (boundary: PolygonInput) => void;
};

function DrawingTools({ isDrawing, onShapeDrawn }: DrawingProps) {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: "topleft",
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawText: false,
      cutPolygon: false,
      rotateMode: false,
    });

    map.pm.setLang("fr");

    function handleCreate(event: { layer: L.Layer }) {
      const layer = event.layer as L.Polygon;
      onShapeDrawn(toGeoJsonPolygon(layer));
      map.removeLayer(layer);
    }

    map.on("pm:create", handleCreate);

    return () => {
      map.off("pm:create", handleCreate);
      map.pm.removeControls();
    };
  }, [map, onShapeDrawn]);

  useEffect(() => {
    if (isDrawing) {
      map.pm.enableDraw("Polygon", { snappable: true, snapDistance: 20 });
    } else {
      map.pm.disableDraw();
    }
  }, [map, isDrawing]);

  return null;
}

function MapFocus({ boundary }: { boundary: PolygonInput | null }) {
  const map = useMap();

  useEffect(() => {
    if (!boundary) return;
    const positions = toLeafletPositions(boundary);
    if (positions.length === 0) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
  }, [map, boundary]);

  return null;
}

type Props = {
  zones: ZoneListItem[];
  selectedZoneId: number | null;
  isDrawing: boolean;
  draftBoundary: PolygonInput | null;
  onSelectZone: (zoneId: number) => void;
  onShapeDrawn: (boundary: PolygonInput) => void;
};

export default function ZoneMap({
  zones,
  selectedZoneId,
  isDrawing,
  draftBoundary,
  onSelectZone,
  onShapeDrawn,
}: Props) {
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? null;
  const focus = draftBoundary ?? selectedZone?.boundary ?? null;

  return (
    <MapContainer center={LYON_CENTER} zoom={12} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={toLeafletPositions(zone.boundary)}
          eventHandlers={{ click: () => onSelectZone(zone.id) }}
          pathOptions={{
            color: zone.color,
            weight: zone.id === selectedZoneId ? 4 : 2,
            fillOpacity: zone.active ? (zone.id === selectedZoneId ? 0.3 : 0.16) : 0.06,
            dashArray: zone.active ? undefined : "6 5",
          }}
        />
      ))}

      {draftBoundary && (
        <Polygon
          positions={toLeafletPositions(draftBoundary)}
          pathOptions={{ color: "#f46036", weight: 3, fillOpacity: 0.3, dashArray: "8 6" }}
        />
      )}

      <DrawingTools isDrawing={isDrawing} onShapeDrawn={onShapeDrawn} />
      <MapFocus boundary={focus} />
    </MapContainer>
  );
}
