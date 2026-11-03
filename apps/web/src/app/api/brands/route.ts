import { NextResponse } from "next/server";
import { getBrands } from "@/lib/cms/client";

export const revalidate = 3600;

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
