import type { TopicContent } from "../../lib/schema.ts";
import unit01 from "./unit01.ts";
import unit02 from "./unit02.ts";
import unit03 from "./unit03.ts";
import unit04 from "./unit04.ts";
import unit05 from "./unit05.ts";
import unit06 from "./unit06.ts";
import unit07 from "./unit07.ts";
import unit08 from "./unit08.ts";
import unit09 from "./unit09.ts";
import unit10 from "./unit10.ts";
import unit11 from "./unit11.ts";

/** Hand-written lesson + question pool for every topic, keyed by topic id. */
export const BANK: Record<number, TopicContent> = Object.fromEntries(
  [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, unit09, unit10, unit11]
    .flat()
    .map((t) => [t.topicId, t]),
);
