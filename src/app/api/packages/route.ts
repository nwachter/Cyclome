import { NextResponse } from "next/server";
import { getActivePackages } from "@/server/catalog";

export async function GET() {
  return NextResponse.json(await getActivePackages());
}
