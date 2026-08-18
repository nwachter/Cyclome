import { isInsideZone, zonesOverlap, zoneAreaKm2, type PolygonGeometry } from "@/lib/geo";

// 2 carrés qui se touchent en partie, autour de Lyon
const zoneEst: PolygonGeometry = {
  type: "Polygon",
  coordinates: [
    [
      [4.84, 45.74],
      [4.92, 45.74],
      [4.92, 45.79],
      [4.84, 45.79],
      [4.84, 45.74],
    ],
  ],
};
const zoneNord: PolygonGeometry = {
  type: "Polygon",
  coordinates: [
    [
      [4.9, 45.78],
      [4.98, 45.78],
      [4.98, 45.83],
      [4.9, 45.83],
      [4.9, 45.78],
    ],
  ],
};
const zoneOuest: PolygonGeometry = {
  type: "Polygon",
  coordinates: [
    [
      [4.7, 45.74],
      [4.78, 45.74],
      [4.78, 45.79],
      [4.7, 45.79],
      [4.7, 45.74],
    ],
  ],
};

describe("isInsideZone", () => {
  it("reconnaît une adresse située dans la zone", () => {
    expect(isInsideZone([4.87, 45.76], zoneEst)).toBe(true);
  });

  it("rejette une adresse en dehors", () => {
    expect(isInsideZone([4.6, 45.7], zoneEst)).toBe(false);
  });
});

describe("zonesOverlap", () => {
  it("détecte deux zones qui se superposent", () => {
    expect(zonesOverlap(zoneEst, zoneNord)).toBe(true);
  });

  it("laisse passer deux zones disjointes", () => {
    expect(zonesOverlap(zoneEst, zoneOuest)).toBe(false);
  });
});

describe("zoneAreaKm2", () => {
  it("calcule une superficie plausible", () => {
    const km2 = zoneAreaKm2(zoneEst);
    expect(km2).toBeGreaterThan(10);
    expect(km2).toBeLessThan(100);
  });
});
