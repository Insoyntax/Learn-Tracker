import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const showAll = request.nextUrl.searchParams.get("all") === "true";
  try {
    const sql = getDb();
    const rows = showAll
      ? await sql`SELECT id, title, rank, xp_reward, is_completed, user_id FROM quests WHERE user_id = ${userId} ORDER BY id LIMIT 100`
      : await sql`SELECT id, title, rank, xp_reward, is_completed, user_id FROM quests WHERE user_id = ${userId} AND is_completed = false ORDER BY id LIMIT 100`;
    return ok(rows);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  try {
    const body = await request.json();
    const { title, rank = "E", xp_reward = 10, is_completed = false } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO quests (title, rank, xp_reward, is_completed, user_id)
      VALUES (${title.trim()}, ${rank}, ${xp_reward}, ${is_completed}, ${userId})
      RETURNING id, title, rank, xp_reward, is_completed, user_id`;
    return ok(rows[0], 201);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
