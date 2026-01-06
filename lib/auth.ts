import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getDefaultPermissionsForRole } from "@/lib/utils/permissions";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            dealer: true,
            permissions: true,
          },
        });

        if (!user || !user.isActive) return null;

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!passwordMatch) return null;

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Get permissions (from DB or defaults based on role)
        const dbPermissions = user.permissions.map((p) => p.permission);
        const permissions =
          dbPermissions.length > 0
            ? dbPermissions
            : getDefaultPermissionsForRole(user.role as UserRole);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          dealerId: user.dealerId,
          dealerName: user.dealer?.name || null,
          dealerSlug: user.dealer?.slug || null,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
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
});

// Helper function to hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper function to verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
