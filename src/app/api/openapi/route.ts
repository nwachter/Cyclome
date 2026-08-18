import { NextResponse } from "next/server";
import { getOpenApiSpec } from "@/lib/openapi";

// page /api-docs. */
export async function GET() {
  return NextResponse.json(getOpenApiSpec());
}
