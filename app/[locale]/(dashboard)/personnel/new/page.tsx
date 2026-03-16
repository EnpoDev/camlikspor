import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { PersonnelForm } from "@/components/personnel/personnel-form";
import { createPersonnelAction } from "@/lib/actions/personnel";
import { redirect } from "next/navigation";

export default async function NewPersonnelPage() {
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect("/login");
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const personnelTypes = await prisma.personnelType.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Personel Ekle</h1>
        <p className="text-muted-foreground">
          Personel bilgilerini girerek yeni personel ekleyin
        </p>
      </div>

      <PersonnelForm
        action={createPersonnelAction}
        personnelTypes={personnelTypes}
        submitLabel="Personel Ekle"
      />
    </div>
  );
}
