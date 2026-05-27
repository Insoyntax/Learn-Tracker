import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;

  const sql = getDb();
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")));
  const offset = (page - 1) * limit;

  try {
    const countRes = await sql`SELECT COUNT(*) as total FROM notes WHERE user_id = ${userId}`;
    const totalItems = parseInt(String(countRes[0].total));
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    const rows = await sql`
      SELECT id, title, content, tags, user_id, created_at, updated_at 
      FROM notes WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    return ok({ items: rows, page, totalPages, totalItems });
  } catch (e) {
    return err("DB_ERROR", String(e), 500);
  }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;

  try {
    const body = await request.json();
    const { title, content, tags } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);

    const sql = getDb();
    const rows = await sql`
      INSERT INTO notes (title, content, tags, user_id)
      VALUES (${title.trim()}, ${content ?? ""}, ${tags ?? []}, ${userId})
      RETURNING id, title, content, tags, user_id, created_at, updated_at`;

    return ok(rows[0], 201);
  } catch (e) {
    return err("DB_ERROR", String(e), 500);
  }
}
