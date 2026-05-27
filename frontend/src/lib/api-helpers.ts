import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Gets the authenticated user ID from the NextAuth session.
 * Call this at the start of every protected API route.
 * 
 * @returns The numeric user ID string, or a 401 NextResponse if not authenticated.
 */
export async function getAuthUserId(): Promise<
  { userId: number; error?: never } | { userId?: never; error: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { status: "error", code: "UNAUTHORIZED", message: "Autentikasi diperlukan" },
        { status: 401 }
      ),
    };
  }
  return { userId: parseInt(session.user.id, 10) };
}

/** Standard success response wrapper */
export function ok(data: unknown, status = 200) {
  return NextResponse.json({ status: "success", data }, { status });
}

/** Standard error response wrapper */
export function err(code: string, message: string, status: number) {
  return NextResponse.json({ status: "error", code, message }, { status });
}
