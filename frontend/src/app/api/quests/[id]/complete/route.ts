import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const questId = parseInt(id);
  if (isNaN(questId)) return err("INVALID_ID", "Invalid quest ID", 400);
  try {
    const body = await request.json();
    const { is_completed = true } = body;
    const sql = getDb();
    const rows = await sql`
      UPDATE quests SET is_completed = ${is_completed} WHERE id = ${questId} AND user_id = ${userId}
      RETURNING id, title, rank, xp_reward, is_completed, user_id`;
    if (rows.length === 0) return err("NOT_FOUND", "Quest not found", 404);
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
