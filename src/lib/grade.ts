import type { Question } from "./schema";

/** The learner's in-progress answer for each question type. */
export type Answer =
  | { type: "mcq"; choice: number | null }
  | { type: "fill"; values: string[] }
  | { type: "match"; pairs: Record<number, number> } // left index -> right index (indexes into q.pairs)
  | { type: "order"; lines: string[] };

export function emptyAnswer(q: Question): Answer {
  switch (q.type) {
    case "mcq":
      return { type: "mcq", choice: null };
    case "fill":
      return { type: "fill", values: q.blanks.map(() => "") };
    case "match":
      return { type: "match", pairs: {} };
    case "order":
      return { type: "order", lines: [] };
  }
}

export function isComplete(q: Question, a: Answer): boolean {
  if (q.type === "mcq" && a.type === "mcq") return a.choice !== null;
  if (q.type === "fill" && a.type === "fill") return a.values.every((v) => v.trim() !== "");
  if (q.type === "match" && a.type === "match") return Object.keys(a.pairs).length === q.pairs.length;
  if (q.type === "order" && a.type === "order") return a.lines.length === q.lines.length;
  return false;
}

export const normalize = (s: string) => s.trim().replace(/\s+/g, " ").replace(/;$/, "");

export function grade(q: Question, a: Answer): boolean {
  if (q.type === "mcq" && a.type === "mcq") return a.choice === q.answer;
  if (q.type === "fill" && a.type === "fill")
    return q.blanks.every((accepted, i) => accepted.some((ok) => normalize(ok) === normalize(a.values[i] ?? "")));
  if (q.type === "match" && a.type === "match") return q.pairs.every((_, i) => a.pairs[i] === i);
  if (q.type === "order" && a.type === "order")
    return a.lines.length === q.lines.length && q.lines.every((line, i) => a.lines[i] === line);
  return false;
}
