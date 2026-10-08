import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { BANK } from "@/data/bank";
import { COURSE_TITLE, UNITS, getTopic, type Topic } from "@/data/syllabus";
import { QuestionSchema, questionProblems, type Question, type Quiz } from "./schema";
import { shuffle } from "./shuffle";

const QUESTIONS_PER_QUIZ = 5;
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5";

/** Shuffle MCQ options (keeping the answer index correct) so position can't be memorized. */
function shuffleOptions(q: Question): Question {
  if (q.type !== "mcq") return q;
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

// ---------- question bank ----------

export function bankQuiz(topicId: number): Quiz {
  const content = BANK[topicId];
  if (!content) throw new Error(`No bank content for topic ${topicId}`);
  return {
    topicId,
    source: "bank",
    lesson: content.lesson,
    questions: shuffle(content.questions).slice(0, QUESTIONS_PER_QUIZ).map(shuffleOptions),
  };
}

// ---------- Claude generation ----------

const SYSTEM_PROMPT = `You write practice questions for TestKraft, a SoloLearn-style mobile app that teaches the course "${COURSE_TITLE}".

Learners are QA engineers moving into automation. Questions must be technically accurate for current Playwright (@playwright/test) and TypeScript, short enough to read on a phone, and test understanding rather than trivia.

Question types (use the exact field shapes in the output schema):
- "mcq": one clearly correct option and 2-3 plausible distractors built from real misconceptions. "answer" is the zero-based index of the correct option. Put any code the question refers to in "code", not in "prompt".
- "fill": "code" contains one "___" marker per blank (1-2 blanks). "blanks" lists, per blank, every accepted answer with the canonical one first. Provide "choices" (4-5 chips) that include each canonical answer plus distractors. Blanks must be unambiguous tokens such as a method name, keyword, type or operator.
- "match": 3-4 pairs. Every left item must match exactly one right item, and every right item must be distinct.
- "order": 3-6 code lines that have exactly ONE valid order. Avoid lines that could be swapped (for example two independent fill() calls). Optionally add 1 distractor line that does not belong. Each line must be unique; keep indentation in the line text.

Rules:
- Prefer role-based locators (getByRole, getByLabel) and web-first assertions in examples. Never use page.waitForTimeout as a correct answer.
- Always await Playwright actions and async assertions in code.
- Keep code to at most 8 lines. Keep prompts to one or two sentences.
- Every "explanation" says why the correct answer is right in 1-2 sentences.
- Do not copy the example lesson's code verbatim; write new scenarios.`;

const SCENARIOS = [
  "an e-commerce checkout",
  "a banking dashboard",
  "a hotel booking site",
  "a todo app",
  "an HR employee portal",
  "a food delivery app",
  "a learning management system",
  "a flight search page",
  "a social media feed",
  "a SaaS admin console",
  "a healthcare appointment booking",
  "a REST API for a library",
];

const AiQuizSchema = z.object({ questions: z.array(QuestionSchema) });

function buildUserPrompt(topic: Topic): string {
  const unit = UNITS.find((u) => u.id === topic.unit)?.title ?? "";
  const lesson = BANK[topic.id]?.lesson ?? [];
  const types = shuffle(["mcq", "mcq", "fill", "match", "order"]);
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

  return `Topic #${topic.id}: ${topic.title}
Unit: ${unit}
Covers: ${topic.focus}

The learner just read this lesson (for context and level; do not repeat its examples):
${lesson.map((s) => `## ${s.heading}\n- ${s.bullets.join("\n- ")}`).join("\n\n")}

Write exactly ${QUESTIONS_PER_QUIZ} questions in this type order: ${types.join(", ")}.
Use ${scenario} as the setting for code examples where it fits.
Cover different sub-points of the topic; do not ask two questions about the same fact.
Variation seed: ${Math.random().toString(36).slice(2, 8)}`;
}

let client: Anthropic | null = null;

async function aiQuestions(topic: Topic): Promise<Question[]> {
  client ??= new Anthropic({ timeout: 90_000, maxRetries: 1 });

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: zodOutputFormat(AiQuizSchema) },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(topic) }],
  });

  if (response.stop_reason === "refusal") throw new Error("Model declined the request");
  if (response.stop_reason === "max_tokens") throw new Error("Model output was truncated");
  if (!response.parsed_output) throw new Error("Model returned no parseable output");

  // Keep only questions that pass the semantic checks the schema can't express.
  const valid = response.parsed_output.questions.filter((q) => {
    const problems = questionProblems(q);
    if (problems.length) console.warn(`[quiz] dropped AI question for topic ${topic.id}:`, problems);
    return problems.length === 0;
  });
  if (valid.length < QUESTIONS_PER_QUIZ - 1) throw new Error(`Only ${valid.length} valid AI questions`);
  return valid;
}

export function aiEnabled(): boolean {
  return process.env.TESTKRAFT_AI !== "off";
}

/** Fresh AI questions when possible, otherwise a shuffled draw from the question bank. */
export async function buildQuiz(topicId: number): Promise<Quiz & { notice?: string }> {
  const topic = getTopic(topicId);
  if (!topic) throw new Error(`Unknown topic ${topicId}`);

  if (aiEnabled()) {
    try {
      const questions = await aiQuestions(topic);
      return {
        topicId,
        source: "ai",
        lesson: BANK[topicId]?.lesson ?? [],
        questions: questions.map(shuffleOptions),
      };
    } catch (error) {
      const notice = describeError(error);
      console.warn(`[quiz] AI generation failed for topic ${topicId}; using question bank. ${notice}`);
      return { ...bankQuiz(topicId), notice };
    }
  }
  return bankQuiz(topicId);
}

function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "Claude API key is missing or invalid.";
  if (error instanceof Anthropic.RateLimitError) return "Claude API rate limit reached.";
  if (error instanceof Anthropic.APIConnectionError) return "Could not reach the Claude API.";
  if (error instanceof Anthropic.APIError) return `Claude API error ${error.status ?? ""}`.trim();
  if (error instanceof Error && /credentials|apiKey|authentication/i.test(error.message))
    return "No Claude API key configured.";
  return error instanceof Error ? error.message : String(error);
}
