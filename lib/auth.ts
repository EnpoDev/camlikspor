import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getDefaultPermissionsForRole, SUB_DEALER_RESTRICTED_PERMISSIONS } from "@/lib/utils/permissions";
import { Permission } from "@/lib/types";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        // New login: set all fields
        token.id = user.id!;
        token.role = user.role;
        token.dealerId = user.dealerId;
        token.dealerName = user.dealerName;
        token.dealerSlug = user.dealerSlug;
        token.permissions = user.permissions;
        token.isSubDealer = user.isSubDealer;
      } else if (token.isSubDealer === undefined && token.dealerId) {
        // Existing session without isSubDealer: check DB
        const dealer = await prisma.dealer.findUnique({
          where: { id: token.dealerId as string },
          select: { parentDealerId: true },
        });
        token.isSubDealer = !!dealer?.parentDealerId;
        if (token.isSubDealer) {
          token.permissions = (token.permissions as string[]).filter(
            (p) => !SUB_DEALER_RESTRICTED_PERMISSIONS.includes(p as Permission)
          );
        }
      }
      return token;
    },
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
        type UserPermission = (typeof user.permissions)[number];
        const dbPermissions = user.permissions.map((p: UserPermission) => p.permission);
        const permissions =
          dbPermissions.length > 0
            ? dbPermissions
            : getDefaultPermissionsForRole(user.role as UserRole);

        // Detect sub-dealer and filter restricted permissions
        const isSubDealer = !!user.dealer?.parentDealerId;
        const effectivePermissions = isSubDealer
          ? permissions.filter(p => !SUB_DEALER_RESTRICTED_PERMISSIONS.includes(p as Permission))
          : permissions;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          dealerId: user.dealerId,
          dealerName: user.dealer?.name || null,
          dealerSlug: user.dealer?.slug || null,
          permissions: effectivePermissions,
          isSubDealer,
        };
      },
    }),
  ],
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
