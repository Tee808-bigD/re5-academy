import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;
let pool: mysql.Pool;

export function getDb() {
  if (!instance) {
    pool = mysql.createPool(env.databaseUrl);
    instance = drizzle(pool, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}

/**
 * Close all database connections gracefully.
 * Should be called during server shutdown.
 */
export async function closeDb() {
  if (pool) {
    await pool.end();
    instance = undefined as any;
    pool = undefined as any;
  }
}
