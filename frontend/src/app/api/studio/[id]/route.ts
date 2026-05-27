import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const taskId = parseInt(id);
  if (isNaN(taskId)) return err("INVALID_ID", "Invalid task ID", 400);
  try {
    const body = await request.json();
    const { status } = body;
    const sql = getDb();
    const rows = await sql`
      UPDATE studio_tasks SET status = ${status} WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING id, title, description, status, category_id, user_id, created_at`;
    if (rows.length === 0) return err("NOT_FOUND", "Task not found", 404);
    return ok(rows[0]);
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const taskId = parseInt(id);
  if (isNaN(taskId)) return err("INVALID_ID", "Invalid task ID", 400);
  try {
    const sql = getDb();
    const rows = await sql`DELETE FROM studio_tasks WHERE id = ${taskId} AND user_id = ${userId} RETURNING id`;
    if (rows.length === 0) return err("NOT_FOUND", "Task not found", 404);
    return ok({ message: "Task deleted successfully" });
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
