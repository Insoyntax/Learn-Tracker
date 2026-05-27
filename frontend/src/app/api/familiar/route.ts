import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET() {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const sql = getDb();
    let rows = await sql`
      SELECT id, user_id, level, current_hp, max_hp, last_fed_at FROM familiar_states WHERE user_id = ${userId}`;
    if (rows.length === 0) {
      rows = await sql`
        INSERT INTO familiar_states (user_id) VALUES (${userId})
        RETURNING id, user_id, level, current_hp, max_hp, last_fed_at`;
    }
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
