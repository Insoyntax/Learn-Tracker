import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ok, err } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthdate, school, username, password } = body;

    if (!name?.trim() || !username?.trim() || !password) {
      return err("VALIDATION_ERROR", "Nama, Username, dan Password wajib diisi", 400);
    }
    if (password.length < 6) {
      return err("VALIDATION_ERROR", "Password minimal harus 6 karakter", 400);
    }

    const sql = getDb();
    const existing = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (existing.length > 0) {
      return err("USERNAME_TAKEN", "Username sudah digunakan oleh orang lain", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const dummyEmail = `${username.trim()}@learntracker.local`;

    const rows = await sql`
      INSERT INTO users (name, email, username, password_hash, birthdate, school, xp, level, current_streak)
      VALUES (${name.trim()}, ${dummyEmail}, ${username.trim()}, ${passwordHash}, ${birthdate ?? null}, ${school?.trim() ?? null}, 0, 1, 0)
      RETURNING id`;

    return ok({ message: "Pendaftaran berhasil! Silakan login.", userId: rows[0].id }, 201);
  } catch (e) {
    return NextResponse.json(
      { status: "error", code: "DB_ERROR", message: String(e) },
      { status: 500 }
    );
  }
}
