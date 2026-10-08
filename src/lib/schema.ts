import { z } from "zod";

/**
 * Content model for TestKraft.
 *
 * A topic has one or more lesson slides (Learn/Review) and a pool of practice
 * questions. A quiz is a randomized selection of questions from the pool
 * (question bank) or a freshly generated set (Claude).
 */

export const LessonSlideSchema = z.object({
  heading: z.string().describe("Short slide title, max ~8 words"),
  bullets: z.array(z.string()).describe("3-4 concise bullet points"),
  code: z.string().nullable().describe("Short TypeScript/Playwright snippet, or null"),
});

export const McqQuestionSchema = z.object({
  type: z.literal("mcq"),
  prompt: z.string(),
  code: z.string().nullable().describe("Optional snippet the question refers to"),
  options: z.array(z.string()).describe("3-4 answer options"),
  answer: z.number().int().describe("Zero-based index of the correct option"),
  explanation: z.string(),
});

export const FillQuestionSchema = z.object({
  type: z.literal("fill"),
  prompt: z.string(),
  /** Code with one or more `___` markers, one per blank. */
  code: z.string().describe("Code containing one ___ marker per blank"),
  /** Accepted answers for each blank, in order. First entry is canonical. */
  blanks: z.array(z.array(z.string())).describe("Accepted answers per blank; first is canonical"),
  /** Optional word bank shown as tappable chips (should include the canonical answers). */
  choices: z.array(z.string()).nullable(),
  explanation: z.string(),
});

export const MatchQuestionSchema = z.object({
  type: z.literal("match"),
  prompt: z.string(),
  pairs: z
    .array(z.object({ left: z.string(), right: z.string() }))
    .describe("3-5 pairs; each left item matches exactly one right item"),
  explanation: z.string(),
});

export const OrderQuestionSchema = z.object({
  type: z.literal("order"),
  prompt: z.string(),
  /** Code lines in the correct order. The UI shuffles them. */
  lines: z.array(z.string()).describe("3-7 code lines in correct order"),
  /** Lines that do not belong in the answer (optional). */
  distractors: z.array(z.string()).nullable(),
  explanation: z.string(),
});

export const QuestionSchema = z.discriminatedUnion("type", [
  McqQuestionSchema,
  FillQuestionSchema,
  MatchQuestionSchema,
  OrderQuestionSchema,
]);

export const TopicContentSchema = z.object({
  topicId: z.number().int(),
  lesson: z.array(LessonSlideSchema).min(1),
  questions: z.array(QuestionSchema).min(4),
});

export const QuizSchema = z.object({
  topicId: z.number().int(),
  source: z.enum(["ai", "bank"]),
  lesson: z.array(LessonSlideSchema),
  questions: z.array(QuestionSchema),
});

export type LessonSlide = z.infer<typeof LessonSlideSchema>;
export type McqQuestion = z.infer<typeof McqQuestionSchema>;
export type FillQuestion = z.infer<typeof FillQuestionSchema>;
export type MatchQuestion = z.infer<typeof MatchQuestionSchema>;
export type OrderQuestion = z.infer<typeof OrderQuestionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type TopicContent = z.infer<typeof TopicContentSchema>;
export type Quiz = z.infer<typeof QuizSchema>;

/**
 * Semantic checks Zod can't express (answer index in range, blank counts match, ...).
 * Returns a list of problems; empty means valid.
 */
export function questionProblems(q: Question): string[] {
  const p: string[] = [];
  switch (q.type) {
    case "mcq":
      if (q.options.length < 2) p.push("mcq needs at least 2 options");
      if (q.answer < 0 || q.answer >= q.options.length) p.push("mcq answer index out of range");
      if (new Set(q.options).size !== q.options.length) p.push("mcq has duplicate options");
      break;
    case "fill": {
      const markers = q.code.split("___").length - 1;
      if (markers === 0) p.push("fill has no ___ marker");
      if (markers !== q.blanks.length) p.push(`fill has ${markers} markers but ${q.blanks.length} blanks`);
      if (q.blanks.some((b) => b.length === 0 || b.some((a) => !a.trim()))) p.push("fill has an empty blank answer");
      if (q.choices && q.blanks.some((b) => !q.choices!.includes(b[0])))
        p.push("fill choices missing a canonical answer");
      break;
    }
    case "match":
      if (q.pairs.length < 2) p.push("match needs at least 2 pairs");
      if (new Set(q.pairs.map((x) => x.left)).size !== q.pairs.length) p.push("match has duplicate left items");
      if (new Set(q.pairs.map((x) => x.right)).size !== q.pairs.length) p.push("match has duplicate right items");
      break;
    case "order":
      if (q.lines.length < 2) p.push("order needs at least 2 lines");
      if (new Set([...q.lines, ...(q.distractors ?? [])]).size !== q.lines.length + (q.distractors?.length ?? 0))
        p.push("order has duplicate lines");
      break;
  }
  return p;
}
