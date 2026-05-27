/**
 * Client-Side Auth Helper Utilities
 * ==================================
 * Provides functions to retrieve the HS256 JWT token for use in API calls
 * to the Go backend. The token is stored by Auth.js in cookies.
 *
 * NOTE: This file is safe to import in client components.
 * For server-side token access, use auth-helpers.server.ts instead.
 *
 * Usage:
 *   import { getClientToken } from "@/lib/auth-helpers";
 *   const token = getClientToken();
 */

// ─── Cookie name used by Auth.js ────────────────────────────────────────────
// Auth.js uses this cookie name in development (HTTP).
// In production (HTTPS), it uses "__Secure-authjs.session-token".
const DEV_COOKIE_NAME = "authjs.session-token";
const PROD_COOKIE_NAME = "__Secure-authjs.session-token";

/**
 * Client-side: reads the JWT directly from the Auth.js cookie via document.cookie.
 * This function is safe to use in Client Components.
 */
export function getClientToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());

  // Try development cookie name first
  let sessionCookie = cookies.find((c) => c.startsWith(`${DEV_COOKIE_NAME}=`));
  if (!sessionCookie) {
    // Try production cookie name
    sessionCookie = cookies.find((c) => c.startsWith(`${PROD_COOKIE_NAME}=`));
  }

  if (!sessionCookie) return null;

  return sessionCookie.split("=").slice(1).join("=");
}
