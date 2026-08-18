import {
  findStartSlots,
  slotsCovered,
  slotsToBlock,
  interventionEnd,
  SLOT_MINUTES,
} from "@/lib/slots";

const at = (h: number, m: number) => new Date(2025, 10, 13, h, m);

// 8 créneaux d'affilée, de 9h - 10h45.
const buildDay = (bookedIndexes: number[] = []) =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    startDate: at(9, i * SLOT_MINUTES),
    booked: bookedIndexes.includes(i),
  }));

describe("slotsCovered", () => {
  it("compte les créneaux recouverts par un forfait", () => {
    expect(slotsCovered(15)).toBe(1);
    expect(slotsCovered(45)).toBe(3);
    expect(slotsCovered(90)).toBe(6);
  });

  it("refuse une durée qui n'est pas un multiple de 15", () => {
    expect(() => slotsCovered(20)).toThrow();
    expect(() => slotsCovered(0)).toThrow();
  });
});

describe("interventionEnd", () => {
  it("calcule l'heure de fin d'après le forfait", () => {
    expect(interventionEnd(at(9, 15), 45)).toEqual(at(10, 0));
  });
});

describe("findStartSlots", () => {
  it("propose tous les départs possibles quand la journée est libre", () => {
    // 8 créneaux, un forfait de 45 min en recouvre 3 : 6 départs possibles
    expect(findStartSlots(buildDay(), 45)).toHaveLength(6);
  });

  it("écarte les départs dont l'intervention déborderait sur un créneau pris", () => {
    // le créneau de 9 h 45 est réservé : impossible de démarrer à 9 h 15 ni 9 h 30
    const starts = findStartSlots(buildDay([3]), 45).map(
      (slot) => slot.startDate.getHours() * 60 + slot.startDate.getMinutes(),
    );
    expect(starts).not.toContain(9 * 60 + 15);
    expect(starts).not.toContain(9 * 60 + 30);
    expect(starts).toContain(9 * 60 + 0);
  });

  it("ne propose rien si la fermeture arrive avant la fin", () => {
    const finDeJournee = buildDay().slice(0, 2); // seulement 30 minutes ouvertes
    expect(findStartSlots(finDeJournee, 45)).toHaveLength(0);
  });

  it("ne recolle pas deux plages séparées par la pause de midi", () => {
    const journee = [
      { id: 1, startDate: at(11, 30), booked: false },
      { id: 2, startDate: at(11, 45), booked: false },
      { id: 3, startDate: at(14, 0), booked: false },
      { id: 4, startDate: at(14, 15), booked: false },
    ];
    expect(findStartSlots(journee, 45)).toHaveLength(0);
  });
});

describe("slotsToBlock", () => {
  it("rend indisponibles le créneau de départ et ceux qu'il recouvre", () => {
    expect(slotsToBlock(buildDay(), 2, 45)).toEqual([2, 3, 4]);
  });

  it("échoue si l'intervention dépasse la fin des disponibilités", () => {
    expect(() => slotsToBlock(buildDay(), 7, 60)).toThrow();
  });
});
