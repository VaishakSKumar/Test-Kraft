import type {
  FillQuestion,
  LessonSlide,
  MatchQuestion,
  McqQuestion,
  OrderQuestion,
  Question,
  TopicContent,
} from "../../lib/schema.ts";

// Compact constructors so the bank files stay readable.

export const slide = (heading: string, bullets: string[], code: string | null = null): LessonSlide => ({
  heading,
  bullets,
  code,
});

export const mcq = (
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  code: string | null = null,
): McqQuestion => ({ type: "mcq", prompt, code, options, answer, explanation });

/** `blanks` entries may be a single accepted answer or a list of accepted answers. */
export const fill = (
  prompt: string,
  code: string,
  blanks: (string | string[])[],
  explanation: string,
  choices: string[] | null = null,
): FillQuestion => ({
  type: "fill",
  prompt,
  code,
  blanks: blanks.map((b) => (Array.isArray(b) ? b : [b])),
  choices,
  explanation,
});

export const match = (prompt: string, pairs: [string, string][], explanation: string): MatchQuestion => ({
  type: "match",
  prompt,
  pairs: pairs.map(([left, right]) => ({ left, right })),
  explanation,
});

export const order = (
  prompt: string,
  lines: string[],
  explanation: string,
  distractors: string[] | null = null,
): OrderQuestion => ({ type: "order", prompt, lines, distractors, explanation });

export const topic = (topicId: number, lesson: LessonSlide[], questions: Question[]): TopicContent => ({
  topicId,
  lesson,
  questions,
});
