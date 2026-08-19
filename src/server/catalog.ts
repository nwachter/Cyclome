import { prisma } from "@/lib/prisma";

export async function getActivePackages() {
  const packages = await prisma.package.findMany({
    where: { active: true },
    include: { operationType: true },
    orderBy: [{ operationTypeId: "asc" }, { price: "asc" }],
  });

  return packages.map((item) => ({
    id: item.id,
    name: item.name ?? "Forfait",
    duration: item.duration,
    price: Number(item.price),
    description: item.description,
    operationTypeId: item.operationTypeId,
    operationTypeName: item.operationType.name,
  }));
}

export type PackageItem = Awaited<ReturnType<typeof getActivePackages>>[number];

export async function getOperationTypes() {
  return prisma.operationType.findMany({ orderBy: { id: "asc" } });
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name ?? "Produit",
    reference: product.reference,
    price: Number(product.price),
    description: product.description,
  }));
}

export type ProductItem = Awaited<ReturnType<typeof getActiveProducts>>[number];
