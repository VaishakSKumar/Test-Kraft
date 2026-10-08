// Validates the hand-written question bank: schema, semantic checks, and coverage.
// Run: npm run check:bank
import { BANK } from "../src/data/bank/index.ts";
import { TOPICS } from "../src/data/syllabus.ts";
import { TopicContentSchema, questionProblems } from "../src/lib/schema.ts";

let errors = 0;
for (const t of TOPICS) {
  const content = BANK[t.id];
  if (!content) {
    console.error(`#${t.id} ${t.title}: missing from bank`);
    errors++;
    continue;
  }
  const parsed = TopicContentSchema.safeParse(content);
  if (!parsed.success) {
    console.error(`#${t.id}: schema error`, parsed.error.issues);
    errors++;
  }
  content.questions.forEach((q, i) => {
    for (const p of questionProblems(q)) {
      console.error(`#${t.id} q${i + 1} (${q.type}): ${p}`);
      errors++;
    }
  });
  const types = new Set(content.questions.map((q) => q.type));
  if (types.size < 4) console.warn(`#${t.id}: only ${types.size} question types`);
}
const total = Object.values(BANK).reduce((n, t) => n + t.questions.length, 0);
console.log(`${Object.keys(BANK).length} topics, ${total} questions, ${errors} error(s)`);
process.exit(errors ? 1 : 0);
