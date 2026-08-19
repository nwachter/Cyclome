import { NextResponse } from "next/server";
import { getActiveProducts } from "@/server/catalog";

export async function GET() {
  return NextResponse.json(await getActiveProducts());
}
