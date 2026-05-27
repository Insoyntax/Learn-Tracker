import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const fcId = parseInt(id);
  if (isNaN(fcId)) return err("INVALID_ID", "Invalid flashcard ID", 400);
  try {
    const body = await request.json();
    const { next_review_date, interval, ease_factor } = body;
    const sql = getDb();
    const rows = await sql`
      UPDATE flashcards SET next_review_date = ${next_review_date}, interval = ${interval}, ease_factor = ${ease_factor}
      WHERE id = ${fcId} AND user_id = ${userId}
      RETURNING id, front, back, category_id, user_id, next_review_date, interval, ease_factor`;
    if (rows.length === 0) return err("NOT_FOUND", "Flashcard not found", 404);
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
