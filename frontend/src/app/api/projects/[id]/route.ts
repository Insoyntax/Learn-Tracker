import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUserId, ok, err } from "@/lib/api-helpers";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await getAuthUserId();
  if (error) return error;
  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) return err("INVALID_ID", "Invalid project ID", 400);
  try {
    const sql = getDb();
    const rows = await sql`DELETE FROM projects WHERE id = ${projectId} AND user_id = ${userId} RETURNING id`;
    if (rows.length === 0) return err("NOT_FOUND", "Project not found", 404);
    return ok({ message: "Project deleted successfully" });
  } catch (e) { return err("DB_ERROR", String(e), 500); }
}
