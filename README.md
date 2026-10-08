# TestKraft

A SoloLearn-style app for learning **Playwright with TypeScript (Web & API Testing)**. It has 61 topics on a curved learning path. Each topic has a short lesson, then a 5-question practice quiz. Score 80% or more to complete the topic (it turns green) and unlock the next one.

- **Fresh questions every attempt.** Claude generates a new quiz each time you start or retake a topic.
- **Always works offline from AI.** If there's no API key or a call fails, the app draws from a built-in bank of 305 questions (5 per topic).
- **Four question types:** multiple choice, fill-in-the-blanks (with a word bank), tap-to-match pairs, and "build the code" line ordering.
- **Progress is saved locally** in SQLite: best score per topic, XP, and a daily streak.

## Run it locally

Requirements: **Node.js 22.13 or newer** (it uses Node's built-in `node:sqlite`, so there's nothing native to compile).

```bash
npm install
```

```bash
cp .env.example .env.local
```

Open `.env.local` and set `ANTHROPIC_API_KEY` (get one at https://console.anthropic.com/settings/keys). Skip this step to run with the question bank only.

```bash
npm run dev
```

Then open http://localhost:3000. On a phone on the same Wi-Fi, use the "Network" URL that `next dev` prints.

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` then `npm start` | Production build and server |
| `npm run lint` | Type-check the project |
| `npm run check:bank` | Validate all 61 topics in the question bank (answer indexes, blank counts, duplicate lines, ...) |
| `npm run export:schema` | Regenerate the JSON Schema files in `docs/schema/` |
| `npm run reset:progress` | Delete the local database and start over |

### Configuration (`.env.local`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | none | Enables AI-generated quizzes |
| `ANTHROPIC_MODEL` | `claude-opus-5-5` | Model for quiz generation. `claude-sonnet-5-5` is cheaper and faster. |
| `TESTKRAFT_AI` | on | Set to `off` to always use the question bank |
| `NEXT_PUBLIC_APP_NAME` | `TestKraft` | Brand name: `TestKraft`, `QA Flow` or `PlayScript` |
| `TESTKRAFT_DB` | `data/testkraft.db` | SQLite file location |

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | One project for UI and API routes; Turbopack dev server |
| Styling | Tailwind CSS v4 | Brand tokens and animations live in `src/app/globals.css` |
| AI | Anthropic SDK + structured outputs (Zod) | Output is validated against the same schema the UI uses |
| Storage | SQLite via `node:sqlite` | Zero setup, single file, no native build on Windows |
| Icons | lucide-react | |

The original request mentioned Next.js 14 and Claude 3.5 Sonnet. Both are outdated now, so this uses current versions.

## How it fits together

```
src/
├─ app/
│  ├─ page.tsx               → <AppShell/>
│  ├─ icon.svg               favicon (Next picks it up automatically)
│  └─ api/
│     ├─ progress/route.ts   GET  progress, XP, streak, active topic
│     ├─ lesson/route.ts     GET  lesson slides for a topic (instant)
│     ├─ quiz/route.ts       POST generate a quiz (AI, falling back to the bank)
│     └─ attempts/route.ts   POST record a score; unlocks the next topic at ≥80%
├─ components/
│  ├─ AppShell.tsx           header, course card, search, wiring
│  ├─ Roadmap.tsx            curved SVG path + Green/Yellow/Grey nodes
│  ├─ TopicSheet.tsx         bottom sheet for a topic
│  ├─ LessonRunner.tsx       lesson slides → questions → results
│  └─ questions/             Mcq, Fill, Match, Order
├─ data/
│  ├─ syllabus.ts            61 topics, 11 units, XP, and a "focus" line per topic
│  └─ bank/                  hand-written lessons + questions (unit01.ts … unit11.ts)
└─ lib/
   ├─ schema.ts              Zod schemas for lessons, questions and quizzes
   ├─ quiz.ts                Claude prompt + generation + bank fallback
   ├─ grade.ts               answer checking
   └─ db.ts                  SQLite progress, unlock rules, streak
```

**Lesson first, quiz in the background.** When you open a topic, the lesson loads instantly from the bank while the quiz is generated in parallel. That usually hides the AI latency.

**Unlocking is enforced on the server.** `recordAttempt` in [src/lib/db.ts](src/lib/db.ts) refuses scores for locked topics, and `/api/quiz` refuses to generate them.

**AI generation** ([src/lib/quiz.ts](src/lib/quiz.ts)) sends the topic title, its focus line and the lesson as context. It also adds a random question-type order, a random app scenario (banking, e-commerce, ...) and a variation seed, so retakes differ. The response is parsed against the Zod schema, then each question goes through `questionProblems()` (answer index in range, one `___` per blank, unique match items, unique order lines). Invalid questions are dropped. If fewer than 4 survive, or the call fails or is declined, the quiz falls back to the bank and the UI shows a short notice.

## Content schema

The source of truth is [src/lib/schema.ts](src/lib/schema.ts). JSON Schema exports are in [docs/schema/](docs/schema/).

```jsonc
// TopicContent: one per topic in the bank
{
  "topicId": 19,
  "lesson": [{ "heading": "Built-in locators", "bullets": ["..."], "code": "await page.getByRole(...)" }],
  "questions": [
    { "type": "mcq",   "prompt": "...", "code": null, "options": ["...", "..."], "answer": 1, "explanation": "..." },
    { "type": "fill",  "prompt": "...", "code": "page.getByRole('___', { ___: 'Save' })",
      "blanks": [["button"], ["name"]], "choices": ["button", "name", "text", "label"], "explanation": "..." },
    { "type": "match", "prompt": "...", "pairs": [{ "left": "getByLabel", "right": "<label> text" }], "explanation": "..." },
    { "type": "order", "prompt": "...", "lines": ["const x = ...;", "await x.fill('a');"], "distractors": null, "explanation": "..." }
  ]
}
```

To edit content, change the files in `src/data/bank/` and run `npm run check:bank`.

## Roadmap node styles

The Green/Yellow/Grey node styles are in `NODE_STYLES` in [src/components/Roadmap.tsx:202](src/components/Roadmap.tsx:202):

```ts
const NODE_STYLES: Record<NodeState, string> = {
  completed: "bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_6px_0_#047857] ...", // 🟢 ≥80%
  active:    "bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 shadow-[0_6px_0_#b45309] ...",     // 🟡 unlocked
  locked:    "bg-slate-800 text-slate-500 shadow-[0_6px_0_#0b1220]",                                       // 🩶 locked
};
```

The path is a single SVG of S-curves between node centers. Segments out of completed nodes are emerald, the segment into the active node fades from emerald to amber, and locked segments are dotted.

## Brand assets

| File | Use |
| --- | --- |
| [public/brand/icon.svg](public/brand/icon.svg) | Full-bleed 512×512 master with no transparency. Export iOS (1024×1024) and Android adaptive icons from this file; the OS applies the corner mask. The emblem sits inside Android's 66% safe zone. |
| [public/brand/logo.svg](public/brand/logo.svg) | Squircle-clipped version for in-app and web use |
| [src/app/icon.svg](src/app/icon.svg) | Browser favicon |

Design: a cyan `{ }` code-brace pair around an emerald play button with a check cut into it (run → pass), on a glass tile over Dark Slate, with an amber "progress" spark. Palette: Emerald `#10B981`, Amber `#F59E0B`, Slate `#0F172A`, Cyan `#06B6D4`.

The original prototype and Gemini icon are kept in `reference/` for comparison.
