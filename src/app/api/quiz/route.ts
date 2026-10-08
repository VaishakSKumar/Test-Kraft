import { NextResponse } from "next/server";
import { getProgress } from "@/lib/db";
import { buildQuiz } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { topicId } = (await req.json().catch(() => ({}))) as { topicId?: number };
  if (!Number.isInteger(topicId)) return NextResponse.json({ error: "topicId is required" }, { status: 400 });

  const { activeId } = getProgress();
  if (activeId !== null && topicId! > activeId)
    return NextResponse.json({ error: "This topic is locked" }, { status: 403 });

  try {
    return NextResponse.json(await buildQuiz(topicId!));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
