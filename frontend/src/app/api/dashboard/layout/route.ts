import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET() {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const sql = getDb();
    let rows = await sql`
      SELECT id, user_id, layout_data, updated_at FROM dashboard_layouts WHERE user_id = ${userId}`;
    if (rows.length === 0) {
      rows = await sql`
        INSERT INTO dashboard_layouts (user_id, layout_data) VALUES (${userId}, ${"[]"})
        RETURNING id, user_id, layout_data, updated_at`;
    }
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function PUT(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { layout_data } = body;
    const sql = getDb();
    const rows = await sql`
      INSERT INTO dashboard_layouts (user_id, layout_data) VALUES (${userId}, ${layout_data ?? "[]"})
      ON CONFLICT (user_id) DO UPDATE SET layout_data = EXCLUDED.layout_data, updated_at = NOW()
      RETURNING id, user_id, layout_data, updated_at`;
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
