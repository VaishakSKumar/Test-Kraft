// Writes JSON Schema files for the content model to docs/schema/.
// Run: npm run export:schema
import { writeFileSync, mkdirSync } from "node:fs";
import { z } from "zod";
import { QuestionSchema, QuizSchema, TopicContentSchema } from "../src/lib/schema.ts";

mkdirSync("docs/schema", { recursive: true });
const files = {
  "topic-content.schema.json": TopicContentSchema,
  "question.schema.json": QuestionSchema,
  "quiz.schema.json": QuizSchema,
};
for (const [name, schema] of Object.entries(files)) {
  writeFileSync(`docs/schema/${name}`, JSON.stringify(z.toJSONSchema(schema), null, 2) + "\n");
  console.log(`docs/schema/${name}`);
}
