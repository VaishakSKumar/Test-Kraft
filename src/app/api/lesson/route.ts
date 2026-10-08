import { NextResponse } from "next/server";
import { BANK } from "@/data/bank";

// Lessons are static, so they load instantly while the quiz is generated.
export function GET(req: Request) {
  const topicId = Number(new URL(req.url).searchParams.get("topicId"));
  const content = BANK[topicId];
  if (!content) return NextResponse.json({ error: "Unknown topic" }, { status: 404 });
  return NextResponse.json({ topicId, lesson: content.lesson });
}
