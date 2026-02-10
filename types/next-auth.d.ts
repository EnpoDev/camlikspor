import { UserRole } from "@/lib/types";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      dealerId: string | null;
      dealerName: string | null;
      dealerSlug: string | null;
      permissions: string[];
      isSubDealer: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    dealerId: string | null;
    dealerName: string | null;
    dealerSlug: string | null;
    permissions: string[];
    isSubDealer: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    dealerId: string | null;
    dealerName: string | null;
    dealerSlug: string | null;
    permissions: string[];
    isSubDealer: boolean;
  }
}
