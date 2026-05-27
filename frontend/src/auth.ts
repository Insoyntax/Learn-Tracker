/**
 * Auth.js v5 Configuration — Custom HS256 JWT Strategy
 * =====================================================
 *
 * CRITICAL DESIGN DECISION:
 * Auth.js v5 uses encrypted JWE tokens by default, which are impossible to
 * decode in Go without the exact same encryption library. To enable stateless
 * JWT verification in our Go backend, we override `jwt.encode` and `jwt.decode`
 * to produce standard HS256 (HMAC-SHA256) JWTs using the `jose` library.
 *
 * Both this Next.js app and the Go backend share the same AUTH_SECRET env var
 * to sign and verify tokens. This is the core of the cross-platform auth strategy.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { SignJWT, jwtVerify } from "jose";
import type { JWT } from "next-auth/jwt";

import Credentials from "next-auth/providers/credentials";

// ─── Shared Secret ──────────────────────────────────────────────────────────
// AUTH_SECRET must be the same value in both Next.js (.env.local) and Go (.env).
// Minimum 32 characters recommended for HS256 security.
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}

// ─── Custom HS256 JWT Encode/Decode ─────────────────────────────────────────

/**
 * Encodes a standard HS256 JWT instead of the default encrypted JWE.
 * This token can be verified by our Go backend using golang-jwt/jwt/v5.
 */
async function customEncode({ token }: { token?: JWT }): Promise<string> {
  if (!token) {
    throw new Error("Token is required for encoding");
  }
  return new SignJWT({ ...token })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 day expiry
    .setJti(crypto.randomUUID())
    .sign(secret);
}

/**
 * Decodes and verifies an HS256 JWT. Mirrors what the Go backend does.
 */
async function customDecode({
  token,
}: {
  token?: string;
}): Promise<JWT | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JWT;
  } catch {
    // Token invalid or expired — return null to force re-auth
    return null;
  }
}

// ─── Auth.js Configuration ──────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT strategy (not database sessions) so the Go backend
  // can verify tokens statelessly without hitting the DB.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days, matches the JWT expiry above
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const { getDb } = await import("@/lib/db");
          const bcrypt = await import("bcryptjs");

          const sql = getDb();
          const username = String(credentials.username);
          const rows = await sql`
            SELECT id, name, email, username, password_hash, school, birthdate
            FROM users WHERE username = ${username}`;

          if (rows.length === 0) return null;

          const user = rows[0] as {
            id: number; name: string | null; email: string;
            username: string; password_hash: string | null;
            school: string | null; birthdate: string | null;
          };

          if (!user.password_hash) return null; // OAuth-only account

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );
          if (!isValid) return null;

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: null,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],

  // Override JWT encode/decode to use standard HS256 instead of JWE
  jwt: {
    encode: customEncode,
    decode: customDecode,
  },

  // ─── Cookie Configuration ──────────────────────────────────────────────
  // Override the session-token cookie to be non-HttpOnly so that
  // getClientToken() in auth-helpers.ts can read it from document.cookie
  // and attach it as a Bearer token for the Go backend API calls.
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: false, // Allow client-side JS to read the JWT
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    /**
     * JWT callback: runs when token is created (sign-in) or refreshed.
     * We ensure the database user ID is always in `token.sub` so the Go
     * backend can extract it from the JWT claims.
     */
    async jwt({ token, user }) {
      // On initial sign-in, `user` is populated from the OAuth provider
      if (user?.id) {
        token.sub = user.id; // Auth.js user.id = our DB users.id
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    /**
     * Session callback: controls what data is available in `useSession()`
     * on the client side. We expose the userId for frontend use.
     */
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  // Custom pages (optional — uncomment to customize)
  // pages: {
  //   signIn: "/auth/signin",
  // },
});
