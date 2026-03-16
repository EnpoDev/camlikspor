import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";
import { Permission } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp } from "lucide-react";
import { IncomesTable } from "@/components/accounting/incomes-table";
import { IncomeDialog } from "@/components/accounting/income-dialog";

async function getIncomesData(dealerId: string) {
  const [incomes, incomeItems] = await Promise.all([
    prisma.income.findMany({
      where: { dealerId },
      include: {
        incomeItem: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    }),
    prisma.incomeItem.findMany({
      where: {
        dealerId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { incomes, incomeItems };
}

export default async function IncomesPage() {
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect("/login");
  }

  // Check permission
  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.INCOMES_VIEW)) {
    redirect("/dashboard");
  }

  const { incomes, incomeItems } = await getIncomesData(session.user.dealerId);

  // Calculate total incomes
  const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);

  // Format incomes for table
  const formattedIncomes = incomes.map((income) => ({
    id: income.id,
    date: income.date,
    incomeItemName: income.incomeItem.name,
    amount: income.amount,
    paymentMethod: income.paymentMethod,
    receiptNumber: income.receiptNumber || "-",
    createdByName: income.createdBy.name,
    description: income.description,
    incomeItemId: income.incomeItemId,
  }));

  const canCreate = hasPermission(userPermissions, Permission.INCOMES_CREATE);
  const canEdit = hasPermission(userPermissions, Permission.INCOMES_EDIT);
  const canDelete = hasPermission(userPermissions, Permission.INCOMES_DELETE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gelir İşleme</h1>
          <p className="text-muted-foreground">
            Gelir kayıtlarını görüntüleyin ve yönetin
          </p>
        </div>
        {canCreate && (
          <IncomeDialog incomeItems={incomeItems}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Gelir
            </Button>
          </IncomeDialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(totalIncomes)}
            </div>
            <p className="text-xs text-muted-foreground">{incomes.length} kayıt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gelir Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                Yükleniyor...
              </div>
            }
          >
            <IncomesTable
              data={formattedIncomes}
              incomeItems={incomeItems}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
