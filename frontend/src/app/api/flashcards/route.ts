import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET() {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, front, back, category_id, user_id, next_review_date, interval, ease_factor
      FROM flashcards WHERE user_id = ${userId} ORDER BY id LIMIT 100`;
    return ok(rows);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { front, back, category_id, interval = 1, ease_factor = 2.5 } = body;
    if (!front?.trim() || !back?.trim()) return err("VALIDATION_ERROR", "Front and back are required", 400);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO flashcards (front, back, category_id, user_id, interval, ease_factor)
      VALUES (${front.trim()}, ${back.trim()}, ${category_id}, ${userId}, ${interval}, ${ease_factor})
      RETURNING id, front, back, category_id, user_id, next_review_date, interval, ease_factor`;
    return ok(rows[0], 201);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
