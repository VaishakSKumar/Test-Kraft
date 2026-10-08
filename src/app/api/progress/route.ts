import { NextResponse } from "next/server";
import { getProgress } from "@/lib/db";
import { aiEnabled } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ...getProgress(), aiEnabled: aiEnabled() });
}
