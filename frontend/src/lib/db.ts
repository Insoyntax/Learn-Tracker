import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a singleton Neon SQL client.
 * Neon's `sql` tagged template function is used for safe, parameterized queries.
 * 
 * USAGE (tagged template — SQL injection safe):
 *   const sql = getDb();
 *   const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
 */
export function getDb(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}
