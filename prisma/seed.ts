// Jeu de données de départ.
//Lancé par `npm run db:seed`
// Les comptes passent par Better Auth plutôt que par une sertion directe, mdps hashés par cette librairie aussi

import {
  PrismaClient,
  UserRole,
  CycleType,
  InterventionStatus,
  PictureStage,
} from "@prisma/client";
import { auth } from "../src/lib/auth";
import { SLOT_MINUTES, findStartSlots, slotsToBlock } from "../src/lib/slots";
import type { CycleCategory } from "../src/lib/cycles"; //pas de @, seed exec hors pipeline Next
const prisma = new PrismaClient();

const OPENING_HOUR = 8;
const CLOSING_HOUR = 19;
const DAYS_TO_GENERATE = 21;

//crée un compte s'il n'existe pas déjà, puis force son rôle.
async function createUserIfNoneExists(
  email: string,
  name: string,
  password: string,
  role: UserRole,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  await auth.api.signUpEmail({ body: { email, name, password } });
  return prisma.user.update({ where: { email }, data: { role, status: "ACTIVE" } });
}

async function main() {
  console.log("Début du seeding de la base de données Cyclôme");

  // Start cleanup
  await prisma.contain.deleteMany();
  await prisma.picture.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.product.deleteMany();
  await prisma.package.deleteMany();
  await prisma.operationType.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.client.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.society.deleteMany();

  //Society
  console.log("Société");
  await prisma.society.create({
    data: {
      name: "Cyclôme",
      address: "14 rue de la Villette, 69003 Lyon",
      phone: "04 78 00 00 00",
      description:
        "La réparation vélo à domicile. Un service de l'atelier LeCycleLyonnais, ouvert depuis 1958.",
    },
  });

  //Users + Client/Techs/Admin
  console.log("Comptes…");
  const admin = await createUserIfNoneExists(
    "admin@cyclome.fr",
    "Marion Bertrand",
    "AdminCyclome2026!",
    UserRole.ADMIN,
  );

  const clientUser = await createUserIfNoneExists(
    "client@cyclome.fr",
    "Julien Mercier",
    "ClientCyclome2026!",
    UserRole.CLIENT,
  );
  console.log(`  administrateur : ${admin.email}`);

  const client = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      userId: clientUser.id,
      firstname: "Julien",
      lastname: "Mercier",
      address: "24 rue Paul Bert",
      postalCode: "69003",
      city: "Lyon",
      phone: "06 12 34 56 78",
      location: { type: "Point", coordinates: [4.8512, 45.7601] },
    },
  });

  //Operation Types
  console.log("Types d'opération et forfaits");
  const entretien = await prisma.operationType.create({
    data: { name: "Entretien", description: "Révisions et réglages courants" },
  });
  const reparation = await prisma.operationType.create({
    data: { name: "Réparation", description: "Remplacement de pièces et remises en état" },
  });
  const diagnostic = await prisma.operationType.create({
    data: { name: "Diagnostic électrique", description: "Moteur, batterie et capteurs" },
  });

  // Toutes les durées = multiples du pas créneau 15
  const packages = [
    { name: "Mise au point", duration: 30, price: 39, operationTypeId: entretien.id },
    { name: "Révision complète", duration: 60, price: 89, operationTypeId: entretien.id },
    { name: "Réparation ciblée", duration: 45, price: 59, operationTypeId: reparation.id },
    { name: "Contrôle batterie", duration: 30, price: 39, operationTypeId: diagnostic.id },
    { name: "Diagnostic VAE", duration: 45, price: 69, operationTypeId: diagnostic.id },
    { name: "Révision complète VAE", duration: 90, price: 139, operationTypeId: diagnostic.id },
  ];
  const createdPackages = [];
  for (const pack of packages) {
    createdPackages.push(await prisma.package.create({ data: { ...pack, active: true } }));
  }

  //Products
  console.log("Produits");
  const products = [
    { reference: "FRE-1182", name: "Plaquettes de frein hydrauliques", price: 24 },
    { reference: "PNE-0304", name: 'Chambre à air 27,5" valve Presta', price: 9.5 },
    { reference: "ECL-0771", name: "Éclairage avant 80 lux", price: 34.9 },
    { reference: "TRA-0210", name: "Chaîne 11 vitesses", price: 32 },
    { reference: "ACC-0455", name: "Antivol U niveau 2", price: 49.9 },
  ];
  for (const product of products) {
    await prisma.product.upsert({
      where: { reference: product.reference },
      update: product,
      create: { ...product, status: "ACTIVE" },
    });
  }

  //Bikes

  const _bikeCommonTypes = [
    {
      name: "VAE Urbain (Vélo à Assistance Électrique)",
      description: "Vélo électrique pour déplacements citadins",
    },
    {
      name: "VAE Tout-Chemin / Trekking",
      description: "Vélo électrique polyvalent ville et chemins",
    },
    { name: "VTT (Vélo Tout Terrain)", description: "VTT musculaire ou électrique" },
    { name: "Vélo de Route / Course", description: "Vélo léger pour bitume" },
    {
      name: "Cargo / Longtail",
      description: "Vélo utilitaire pour transport de charges ou enfants",
    },
  ];
  const _bikeCommonBrands = [
    "Decathlon / B'Twin / Van Rysel",
    "Trek",
    "Specialized",
    "Giant",
    "Cannondale",
    "Cube",
    "Scott",
    "Orbea",
    "Merida",
    "Rad Power Bikes",
    "Moustache Bikes",
    "Gazelle",
    "Stromer",
    "Haibike",
    "Lapierre",
    "Btwin",
    "Riverside",
    "Elops",
    "Brompton",
    "Riese & Müller",
    "Focus",
    "BMC",
    "Canyon",
    "Cube",
    "KTM",
  ];

  const bikes = [
    {
      clientId: client.id,
      type: CycleType.ELECTRICAL,
      category: "Ville" satisfies CycleCategory,
      brand: "Gitane",
      model: "e-Verso",
      year: 2021,
      motorisation: "Bosch : moteur central",
      status: "ACTIVE",
    },
    {
      clientId: client.id,
      type: CycleType.ELECTRICAL,
      category: "Cargo" satisfies CycleCategory,
      brand: "Riese & Müller",
      model: "Load 60",
      year: 2023,
      motorisation: "Bosch Cargo Line",
      status: "ACTIVE",
    },
    {
      clientId: client.id,
      type: CycleType.MECHANICAL,
      category: "VTC" satisfies CycleCategory,
      brand: "Btwin",
      model: "Riverside 500",
      year: 2019,
      status: "ACTIVE",
    },
  ];

  if ((await prisma.cycle.count({ where: { clientId: client.id } })) === 0) {
    await prisma.cycle.createMany({ data: bikes });
  }
  //Zones & Techq

  console.log("Techniciens et zones…");

  const technicianSeeds = [
    { email: "karim@cyclome.fr", name: "Karim Benali", phone: "06 11 22 33 44" },
    { email: "sofia@cyclome.fr", name: "Sofia Roche", phone: "06 22 33 44 55" },
    { email: "malik@cyclome.fr", name: "Malik Traoré", phone: "06 33 44 55 66" },
    { email: "elodie@cyclome.fr", name: "Élodie Petit", phone: "06 44 55 66 77" },
  ];

  const technicians = [];
  for (const seed of technicianSeeds) {
    const user = await createUserIfNoneExists(
      seed.email,
      seed.name,
      "TechCyclome2026!",
      UserRole.TECHNICIAN,
    );
    technicians.push(
      await prisma.technician.create({ data: { userId: user.id, phone: seed.phone } }),
    );
  }

  // Quatre zones autour de Lyon.
  // const zoneSeeds = [
  //   {
  //     name: "Est",
  //     color: "#f46036",
  //     description: "Lyon 3e, 6e, 7e et communes limitrophes à l'est du Rhône.",
  //     box: [4.86, 45.75, 4.95, 45.79],
  //   },
  //   {
  //     name: "Nord",
  //     color: "#0b5581",
  //     description: "Caluire, Rillieux et le nord de la Croix-Rousse.",
  //     box: [4.82, 45.79, 4.92, 45.83],
  //   },
  //   {
  //     name: "Ouest",
  //     color: "#17795c",
  //     description: "Lyon 5e, 9e, Tassin et Écully.",
  //     box: [4.74, 45.75, 4.83, 45.79],
  //   },
  //   {
  //     name: "Sud",
  //     color: "#d69e12",
  //     description: "Lyon 7e sud, 8e, Vénissieux et Saint-Fons.",
  //     box: [4.84, 45.7, 4.93, 45.74],
  //   },
  // ];

  const zoneSeeds = [
    {
      name: "Est",
      color: "#f46036",
      description: "Lyon 3e, 6e, 7e et communes limitrophes à l'est du Rhône.",
      box: [4.83, 45.75, 4.95, 45.83],
    },
    {
      name: "Nord",
      color: "#0b5581",
      description: "Caluire, Rillieux et le nord de la Croix-Rousse.",
      box: [4.74, 45.83, 4.95, 45.9],
    },
    {
      name: "Ouest",
      color: "#17795c",
      description: "Lyon 5e, 9e, Tassin et Écully.",
      box: [4.74, 45.7, 4.83, 45.83],
    },
    {
      name: "Sud",
      color: "#d69e12",
      description: "Lyon 8e, Vénissieux et Saint-Fons.",
      box: [4.83, 45.7, 4.95, 45.75],
    },
  ];

  const zones = [];
  for (const [index, seed] of zoneSeeds.entries()) {
    const [west, south, east, north] = seed.box as [number, number, number, number];
    zones.push(
      await prisma.zone.create({
        data: {
          name: seed.name,
          description: seed.description,
          color: seed.color,
          active: seed.name !== "Sud", // une zone en pause, pour l'état de la maquette
          technicianId: technicians[index]!.id,
          boundary: {
            type: "Polygon",
            coordinates: [
              [
                [west, south],
                [east, south],
                [east, north],
                [west, north],
                [west, south],
              ],
            ],
          },
        },
      }),
    );
  }

  // console.log("Zone");
  // const eastZone = await prisma.zone.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     name: "Est",
  //     description: "Lyon 3e, 6e, 7e et communes limitrophes à l'est du Rhône.",
  //     color: "#f46036",
  //     active: true,
  //     technicianId: technician.id,
  //     boundary: {
  //       type: "Polygon",
  //       coordinates: [
  //         [
  //           [4.84, 45.74],
  //           [4.92, 45.74],
  //           [4.92, 45.79],
  //           [4.84, 45.79],
  //           [4.84, 45.74],
  //         ],
  //       ],
  //     },
  //   },
  // });

  //Availab + Slots
  console.log("Disponibilités et créneau");

  // const eastZone = zones.find((zone) => zone.name === "Est")!;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const zone of zones) {
    if (!zone.active) continue; // la zone Sud reste en pause

    for (let jour = 0; jour < DAYS_TO_GENERATE; jour++) {
      const date = new Date(today);
      date.setDate(date.getDate() + jour);
      if (date.getDay() === 0) continue; // atelier fermé le dimanche

      const start = new Date(date);
      start.setHours(OPENING_HOUR, 0, 0, 0);
      const end = new Date(date);
      end.setHours(CLOSING_HOUR, 0, 0, 0);

      const availability = await prisma.availability.create({
        data: { zoneId: zone.id, startDate: start, endDate: end },
      });

      const slots = [];
      for (let t = new Date(start); t < end; t = new Date(t.getTime() + SLOT_MINUTES * 60_000)) {
        slots.push({
          availabilityId: availability.id,
          startDate: new Date(t),
          endDate: new Date(t.getTime() + SLOT_MINUTES * 60_000),
        });
      }
      await prisma.slot.createMany({ data: slots, skipDuplicates: true });
    }
  }

  const total = await prisma.slot.count();
  console.log(`\nTerminé ! ${total} créneaux de ${SLOT_MINUTES}m générés`);
  console.log("Comptes de démo :");
  // console.log("  admin@cyclome.fr   / AdminCyclome2026!");
  // console.log("  karim@cyclome.fr   / TechCyclome2026!");
  // console.log("  client@cyclome.fr  / ClientCyclome2026!");

  //Intervention

  console.log("Intervention de démonstration");

  const sampleCycle = await prisma.cycle.findFirst({ where: { clientId: client.id } });
  const samplePackage = createdPackages[1]!; // Révision complète, 60 min
  const sampleProduct = await prisma.product.findFirst({ where: { reference: "PNE-0304" } });

  // Première disponibilité à venir : sans ce filtre, le rendez-vous de
  // démons tombe aujourd'hui 8h = 3donc déjà passé.
  const sampleAvailability = await prisma.availability.findFirst({
    where: { startDate: { gt: new Date() } },
    orderBy: { startDate: "asc" },
    include: { slots: { orderBy: { startDate: "asc" } }, zone: true },
  });

  if (sampleCycle && sampleProduct && sampleAvailability) {
    const startSlot = findStartSlots(sampleAvailability.slots, samplePackage.duration)[0];

    if (startSlot) {
      const slotIdsToBlock = slotsToBlock(
        sampleAvailability.slots,
        startSlot.id,
        samplePackage.duration,
      );
      await prisma.slot.updateMany({
        where: { id: { in: slotIdsToBlock } },
        data: { booked: true },
      });

      await prisma.intervention.create({
        data: {
          description: "Crevaison répétée et révision générale demandée.",
          address: client.address,
          postalCode: client.postalCode,
          city: client.city,
          location: client.location ?? { type: "Point", coordinates: [4.8512, 45.7601] },
          totalPrice: Number(samplePackage.price) + Number(sampleProduct.price),
          date: startSlot.startDate,
          duration: samplePackage.duration,
          status: InterventionStatus.PENDING,
          clientId: client.id,
          technicianId: sampleAvailability.zone.technicianId!,
          cycleId: sampleCycle.id,
          packageId: samplePackage.id,
          slotId: startSlot.id,
          contains: {
            create: [{ productId: sampleProduct.id, quantity: 1, unitPrice: sampleProduct.price }],
          },
          pictures: {
            create: [
              {
                url: "/uploads/pictures/booking-sample.jpg",
                mimeType: "image/jpeg",
                stage: PictureStage.AT_BOOKING,
                userId: clientUser.id,
              },
            ],
          },
        },
      });

      console.log(
        `  ${startSlot.startDate.toLocaleString("fr-FR")} : ${slotIdsToBlock.length} créneaux bloqués`,
      );
    } else {
      console.warn("  aucune suite de créneaux libres assez longue");
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
