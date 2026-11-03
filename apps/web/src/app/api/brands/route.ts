import { NextResponse } from "next/server";
import { getBrands } from "@/lib/cms/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
