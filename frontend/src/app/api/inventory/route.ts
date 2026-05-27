import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET() {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, type, content, category_id, user_id
      FROM inventory_items WHERE user_id = ${userId} ORDER BY id LIMIT 100`;
    return ok(rows);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { title, type, content, category_id } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO inventory_items (title, type, content, category_id, user_id)
      VALUES (${title.trim()}, ${type ?? "other"}, ${content ?? ""}, ${category_id ?? null}, ${userId})
      RETURNING id, title, type, content, category_id, user_id`;
    return ok(rows[0], 201);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
