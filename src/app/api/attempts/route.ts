import { NextResponse } from "next/server";
import { recordAttempt } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    topicId?: number;
    correct?: number;
    total?: number;
    source?: string;
  };
  const { topicId, correct, total, source } = body;
  if (![topicId, correct, total].every(Number.isInteger))
    return NextResponse.json({ error: "topicId, correct and total must be integers" }, { status: 400 });

  try {
    return NextResponse.json(recordAttempt(topicId!, correct!, total!, source === "ai" ? "ai" : "bank"));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
