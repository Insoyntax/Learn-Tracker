/**
 * Server-Side Auth Helper Utilities
 * ===================================
 * Provides functions to retrieve the HS256 JWT token on the server.
 * This file uses `next/headers` and can ONLY be imported in:
 *   - Server Components
 *   - Server Actions
 *   - Route Handlers
 *
 * Usage:
 *   import { getAuthToken } from "@/lib/auth-helpers.server";
 *   const token = await getAuthToken();
 *   fetch("http://localhost:8000/api/v1/notes", {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 */

import { cookies } from "next/headers";

// ─── Cookie name used by Auth.js ────────────────────────────────────────────
const DEV_COOKIE_NAME = "authjs.session-token";
const PROD_COOKIE_NAME = "__Secure-authjs.session-token";

/**
 * Server-side: reads the JWT directly from the Auth.js cookie.
 * Use this in Server Components, Server Actions, or Route Handlers.
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();

  // Try development cookie name first
  const devCookie = cookieStore.get(DEV_COOKIE_NAME);
  if (devCookie?.value) return devCookie.value;

  // Try production cookie name
  const prodCookie = cookieStore.get(PROD_COOKIE_NAME);
  return prodCookie?.value ?? null;
}
