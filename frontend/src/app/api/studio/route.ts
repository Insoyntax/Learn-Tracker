import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET() {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, description, status, category_id, user_id, created_at
      FROM studio_tasks WHERE user_id = ${userId} ORDER BY id LIMIT 100`;
    return ok(rows);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { title, description, status = "todo", category_id } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO studio_tasks (title, description, status, category_id, user_id)
      VALUES (${title.trim()}, ${description ?? null}, ${status}, ${category_id ?? null}, ${userId})
      RETURNING id, title, description, status, category_id, user_id, created_at`;
    return ok(rows[0], 201);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
