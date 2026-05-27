"use client";

/**
 * Auth Session Provider
 * =====================
 * Client-side wrapper for next-auth's SessionProvider.
 * This must be a client component because SessionProvider uses React Context.
 * 
 * Used in the root layout to make session data available to all components
 * via the `useSession()` hook.
 */

import { SessionProvider } from "next-auth/react";

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
