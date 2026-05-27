// Re-export NextAuth configuration from src/auth.ts to avoid redundancy and prevent session mismatches
export { handlers, auth, signIn, signOut } from "./src/auth";
