import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PASS_PERCENT, TOPICS, getTopic } from "@/data/syllabus";

// Node's built-in SQLite (node:sqlite) needs no native build step.
// One file, one user: this is a personal, local study app.

const DB_FILE = path.resolve(/*turbopackIgnore: true*/ process.env.TESTKRAFT_DB ?? "data/testkraft.db");

const globalForDb = globalThis as unknown as { __testkraftDb?: DatabaseSync };

function open(): DatabaseSync {
  mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const db = new DatabaseSync(DB_FILE);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS attempts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id   INTEGER NOT NULL,
      correct    INTEGER NOT NULL,
      total      INTEGER NOT NULL,
      percent    INTEGER NOT NULL,
      source     TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS topic_progress (
      topic_id     INTEGER PRIMARY KEY,
      best_percent INTEGER NOT NULL,
      attempts     INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      xp_awarded   INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

// Reuse the connection across hot reloads in dev.
const db = (globalForDb.__testkraftDb ??= open());

export interface TopicProgress {
  topicId: number;
  bestPercent: number;
  attempts: number;
  completed: boolean;
}

export interface ProgressSummary {
  topics: TopicProgress[];
  /** Id of the unlocked, not-yet-completed topic, or null when the course is done. */
  activeId: number | null;
  xp: number;
  streak: number;
}

export function getProgress(): ProgressSummary {
  const rows = db
    .prepare("SELECT topic_id, best_percent, attempts, completed_at, xp_awarded FROM topic_progress")
    .all() as { topic_id: number; best_percent: number; attempts: number; completed_at: string | null; xp_awarded: number }[];

  const byId = new Map(rows.map((r) => [r.topic_id, r]));
  const topics: TopicProgress[] = rows.map((r) => ({
    topicId: r.topic_id,
    bestPercent: r.best_percent,
    attempts: r.attempts,
    completed: r.completed_at !== null,
  }));

  // Topics unlock strictly in order: the active one is the first not completed.
  const active = TOPICS.find((t) => !byId.get(t.id)?.completed_at);
  const xp = rows.reduce((sum, r) => sum + r.xp_awarded, 0);

  return { topics, activeId: active?.id ?? null, xp, streak: computeStreak() };
}

function isUnlocked(topicId: number): boolean {
  const { activeId } = getProgress();
  return activeId === null || topicId <= activeId;
}

export interface AttemptResult {
  percent: number;
  passed: boolean;
  newlyCompleted: boolean;
  xpEarned: number;
  progress: ProgressSummary;
}

export function recordAttempt(topicId: number, correct: number, total: number, source: string): AttemptResult {
  const topic = getTopic(topicId);
  if (!topic) throw new Error(`Unknown topic ${topicId}`);
  if (!isUnlocked(topicId)) throw new Error(`Topic ${topicId} is locked`);
  if (total <= 0 || correct < 0 || correct > total) throw new Error("Invalid score");

  const percent = Math.round((correct / total) * 100);
  const passed = percent >= PASS_PERCENT;

  const existing = db
    .prepare("SELECT best_percent, completed_at FROM topic_progress WHERE topic_id = ?")
    .get(topicId) as { best_percent: number; completed_at: string | null } | undefined;

  const newlyCompleted = passed && !existing?.completed_at;
  const xpEarned = newlyCompleted ? topic.xp : 0;

  db.exec("BEGIN");
  try {
    db.prepare("INSERT INTO attempts (topic_id, correct, total, percent, source) VALUES (?, ?, ?, ?, ?)").run(
      topicId,
      correct,
      total,
      percent,
      source,
    );
    db.prepare(
      `INSERT INTO topic_progress (topic_id, best_percent, attempts, completed_at, xp_awarded)
       VALUES (?, ?, 1, CASE WHEN ? THEN datetime('now') END, ?)
       ON CONFLICT(topic_id) DO UPDATE SET
         best_percent = MAX(best_percent, excluded.best_percent),
         attempts     = attempts + 1,
         completed_at = COALESCE(completed_at, excluded.completed_at),
         xp_awarded   = xp_awarded + excluded.xp_awarded`,
    ).run(topicId, percent, passed ? 1 : 0, xpEarned);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }

  return { percent, passed, newlyCompleted, xpEarned, progress: getProgress() };
}

/** Consecutive days (ending today or yesterday, local time) with at least one attempt. */
function computeStreak(): number {
  const rows = db
    .prepare("SELECT DISTINCT date(created_at, 'localtime') AS day FROM attempts ORDER BY day DESC")
    .all() as { day: string }[];
  if (rows.length === 0) return 0;

  const days = new Set(rows.map((r) => r.day));
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const cursor = new Date();
  if (!days.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1); // streak survives until end of today
  let streak = 0;
  while (days.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
