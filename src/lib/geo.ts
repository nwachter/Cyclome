import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import { point, polygon as turfPolygon } from "@turf/helpers";
import area from "@turf/area";

export type Position = [number, number];
export type PolygonGeometry = { type: "Polygon"; coordinates: Position[][] };

/* L'adresse  client tombe-t-elle dans cette zone ? */
export function isInsideZone(coords: Position, boundary: PolygonGeometry): boolean {
  return booleanPointInPolygon(point(coords), turfPolygon(boundary.coordinates));
}

/* 2 zones se superposent-elles ? */
export function zonesOverlap(a: PolygonGeometry, b: PolygonGeometry): boolean {
  return booleanIntersects(turfPolygon(a.coordinates), turfPolygon(b.coordinates));
}

/*Superficie en km², arrondie au dixième */
export function zoneAreaKm2(boundary: PolygonGeometry): number {
  return Math.round((area(turfPolygon(boundary.coordinates)) / 1_000_000) * 10) / 10;
}
