import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { PersonnelForm } from "@/components/personnel/personnel-form";
import { updatePersonnelAction } from "@/lib/actions/personnel";
import { redirect, notFound } from "next/navigation";

interface EditPersonnelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPersonnelPage({ params }: EditPersonnelPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.dealerId) {
    redirect("/login");
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const personnel = await prisma.personnel.findFirst({
    where: dealerId
      ? { id, dealerId, isActive: true }
      : { id, isActive: true },
  });

  if (!personnel) {
    notFound();
  }

  const personnelTypes = await prisma.personnelType.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  const boundAction = updatePersonnelAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personel Düzenle</h1>
        <p className="text-muted-foreground">
          {personnel.firstName} {personnel.lastName} bilgilerini düzenleyin
        </p>
      </div>

      <PersonnelForm
        action={boundAction}
        personnelTypes={personnelTypes}
        defaultValues={{
          firstName: personnel.firstName,
          lastName: personnel.lastName,
          personnelTypeId: personnel.personnelTypeId,
          phone: personnel.phone,
          email: personnel.email || undefined,
          salary: personnel.salary || undefined,
          tcKimlikNo: personnel.tcKimlikNo || undefined,
          address: personnel.address || undefined,
          birthDate: personnel.birthDate,
          notes: personnel.notes || undefined,
          workSchedule: personnel.workSchedule || undefined,
        }}
        submitLabel="Güncelle"
      />
    </div>
  );
}
