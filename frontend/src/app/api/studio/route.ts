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
    
    // Normalize status to uppercase (e.g., 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')
    const normalized = rows.map(r => ({
      ...r,
      status: String(r.status || "TODO").toUpperCase()
    }));
    
    return ok(normalized);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { title, description, status = "TODO", category_id } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);
    const sql = getDb();
    
    const uppercaseStatus = String(status).toUpperCase();
    const rows = await sql`
      INSERT INTO studio_tasks (title, description, status, category_id, user_id)
      VALUES (${title.trim()}, ${description ?? null}, ${uppercaseStatus}, ${category_id ?? null}, ${userId})
      RETURNING id, title, description, status, category_id, user_id, created_at`;
      
    const normalized = {
      ...rows[0],
      status: String(rows[0].status).toUpperCase()
    };
    return ok(normalized, 201);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
