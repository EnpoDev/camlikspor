import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/data/users";
import { redirect } from "next/navigation";
import { ProfileCards } from "@/components/settings/profile-cards";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">
          Kisisel ve kurumsal bilgileriniz
        </p>
      </div>

      <ProfileCards
        user={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          dealer: user.dealer,
        }}
      />
    </div>
  );
}
