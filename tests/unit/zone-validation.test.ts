import { zoneCreateSchema, polygonSchema } from "@/lib/validation/zone";

const closedRing = [
  [4.84, 45.74],
  [4.92, 45.74],
  [4.92, 45.79],
  [4.84, 45.79],
  [4.84, 45.74],
];

describe("polygonSchema", () => {
  it("accepte un anneau ferme", () => {
    expect(polygonSchema.safeParse({ type: "Polygon", coordinates: [closedRing] }).success).toBe(true);
  });

  it("refuse un anneau ouvert", () => {
    const openRing = closedRing.slice(0, 4);
    expect(polygonSchema.safeParse({ type: "Polygon", coordinates: [openRing] }).success).toBe(false);
  });

  it("refuse un trace de moins de trois points", () => {
    const tooShort = [[4.84, 45.74], [4.92, 45.74], [4.84, 45.74]];
    expect(polygonSchema.safeParse({ type: "Polygon", coordinates: [tooShort] }).success).toBe(false);
  });
});

describe("zoneCreateSchema", () => {
  const validZone = {
    name: "Est",
    color: "#f46036",
    boundary: { type: "Polygon" as const, coordinates: [closedRing] },
    technicianId: 1,
    active: true,
  };

  it("accepte une zone complete", () => {
    expect(zoneCreateSchema.safeParse(validZone).success).toBe(true);
  });

  it("accepte une zone sans technicien", () => {
    expect(zoneCreateSchema.safeParse({ ...validZone, technicianId: null }).success).toBe(true);
  });

  it("refuse une couleur mal formee", () => {
    expect(zoneCreateSchema.safeParse({ ...validZone, color: "orange" }).success).toBe(false);
  });
});
