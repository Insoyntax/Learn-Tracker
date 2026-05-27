import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { SignJWT, jwtVerify } from "jose";

// The secret must be consistent between Next.js and Go
const secret = process.env.AUTH_SECRET;
const key = new TextEncoder().encode(secret);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Expose the user ID to the client-side session object
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  jwt: {
    // CRITICAL: Override NextAuth's default JWE completely.
    // We use 'jose' to create an industry-standard HS256 signed JWT
    // so our Go backend can statelessly verify the signature.
    async encode({ token, secret, maxAge }) {
      if (!token) return "";

      const encodedToken = await new SignJWT(token)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(
          Math.floor(Date.now() / 1000) + (maxAge || 30 * 24 * 60 * 60),
        )
        .sign(key); // Signed using the raw bytes of AUTH_SECRET

      return encodedToken;
    },
    async decode({ token, secret }) {
      if (!token) return null;

      try {
        const { payload } = await jwtVerify(token, key, {
          algorithms: ["HS256"],
        });
        return payload;
      } catch (err) {
        return null;
      }
    },
  },
});
