import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@/lib/types";

// Edge-compatible auth config (no Prisma imports)
// The actual authorize logic is in auth.ts which extends this config

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is implemented in auth.ts
      authorize: () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Check if this is an auth page
      const isAuthPage =
        pathname.includes("/login") || pathname.includes("/forgot-password");

      if (isAuthPage) {
        if (isLoggedIn) return false; // Redirect to dashboard
        return true;
      }

      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.dealerId = user.dealerId;
        token.dealerName = user.dealerName;
        token.dealerSlug = user.dealerSlug;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.dealerId = token.dealerId as string | null;
        session.user.dealerName = token.dealerName as string | null;
        session.user.dealerSlug = token.dealerSlug as string | null;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
};
