// Deletes the local SQLite database so progress starts fresh.
import { rmSync } from "node:fs";
const file = process.env.TESTKRAFT_DB ?? "data/testkraft.db";
for (const f of [file, `${file}-wal`, `${file}-shm`]) rmSync(f, { force: true });
console.log(`Progress reset (${file} removed).`);
