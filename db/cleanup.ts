import { getDb } from "../api/queries/connection";

async function cleanup() {
  const db = getDb();
  console.log("Cleaning up existing tables...");

  const tablesToDrop = [
    "audit_log",
    "study_streaks",
    "coaching_messages",
    "coaching_sessions",
    "quiz_results",
    "chapter_progress",
    "users",
  ];

  for (const table of tablesToDrop) {
    try {
      await db.execute(`DROP TABLE IF EXISTS \`${table}\``);
      console.log(`  Dropped ${table}`);
    } catch (e) {
      console.log(`  ${table} did not exist or error: ${(e as Error).message}`);
    }
  }

  console.log("Cleanup complete");
  process.exit(0);
}

cleanup();
