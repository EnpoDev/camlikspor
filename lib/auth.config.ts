import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@/lib/types";

// Edge-compatible auth config (no Prisma imports)
// The actual authorize logic is in auth.ts which extends this config

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/tr/login",
    error: "/tr/login",
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
    authorized() {
      // Let middleware handle all authorization logic
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.dealerId = user.dealerId;
        token.dealerName = user.dealerName;
        token.dealerSlug = user.dealerSlug;
        token.permissions = user.permissions;
        token.isSubDealer = user.isSubDealer;
        token.mustChangePassword = user.mustChangePassword;
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
        session.user.isSubDealer = (token.isSubDealer as boolean) ?? false;
        session.user.mustChangePassword = (token.mustChangePassword as boolean) ?? false;
      }
      return session;
    },
  },
};
