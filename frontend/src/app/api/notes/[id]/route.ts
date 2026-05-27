import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const noteId = parseInt(id);
  if (isNaN(noteId)) return err("INVALID_ID", "Invalid note ID", 400);

  try {
    const body = await request.json();
    const { title, content, tags } = body;
    if (!title?.trim()) return err("VALIDATION_ERROR", "Title is required", 400);

    const sql = getDb();
    const rows = await sql`
      UPDATE notes SET title = ${title.trim()}, content = ${content ?? ""}, tags = ${tags ?? []}, updated_at = NOW()
      WHERE id = ${noteId} AND user_id = ${userId}
      RETURNING id, title, content, tags, user_id, created_at, updated_at`;

    if (rows.length === 0) return err("NOT_FOUND", "Note not found", 404);
    return ok(rows[0]);
  } catch (e) {
    return err("DB_ERROR", String(e), 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const noteId = parseInt(id);
  if (isNaN(noteId)) return err("INVALID_ID", "Invalid note ID", 400);

  try {
    const sql = getDb();
    const rows = await sql`DELETE FROM notes WHERE id = ${noteId} AND user_id = ${userId} RETURNING id`;
    if (rows.length === 0) return err("NOT_FOUND", "Note not found", 404);
    return ok({ message: "Note deleted successfully" });
  } catch (e) {
    return err("DB_ERROR", String(e), 500);
  }
}
