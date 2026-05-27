import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function PUT(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { current_hp, last_fed_at } = body;
    const sql = getDb();

    let rows = await sql`SELECT id, max_hp FROM familiar_states WHERE user_id = ${userId}`;
    if (rows.length === 0) {
      rows = await sql`INSERT INTO familiar_states (user_id) VALUES (${userId}) RETURNING id, max_hp`;
    }

    const maxHp = rows[0].max_hp as number;
    const newHp = Math.min(current_hp ?? maxHp, maxHp);
    const fedAt = last_fed_at ?? new Date().toISOString();

    const updated = await sql`
      UPDATE familiar_states SET current_hp = ${newHp}, last_fed_at = ${fedAt} WHERE user_id = ${userId}
      RETURNING id, user_id, level, current_hp, max_hp, last_fed_at`;
    return ok(updated[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
