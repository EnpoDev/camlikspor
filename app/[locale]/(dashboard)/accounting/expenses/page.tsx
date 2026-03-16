import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";
import { Permission } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Receipt } from "lucide-react";
import { ExpensesTable } from "@/components/accounting/expenses-table";
import { ExpenseDialog } from "@/components/accounting/expense-dialog";

async function getExpensesData(dealerId: string) {
  const [expenses, expenseItems] = await Promise.all([
    prisma.expense.findMany({
      where: { dealerId },
      include: {
        expenseItem: true,
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
    prisma.expenseItem.findMany({
      where: {
        dealerId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { expenses, expenseItems };
}

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect("/login");
  }

  // Check permission
  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.EXPENSES_VIEW)) {
    redirect("/dashboard");
  }

  const { expenses, expenseItems } = await getExpensesData(
    session.user.dealerId
  );

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Format expenses for table
  const formattedExpenses = expenses.map((expense) => ({
    id: expense.id,
    date: expense.date,
    expenseItemName: expense.expenseItem.name,
    amount: expense.amount,
    paymentMethod: expense.paymentMethod,
    invoiceNumber: expense.invoiceNumber || "-",
    createdByName: expense.createdBy.name,
    description: expense.description,
    expenseItemId: expense.expenseItemId,
  }));

  const canCreate = hasPermission(userPermissions, Permission.EXPENSES_CREATE);
  const canEdit = hasPermission(userPermissions, Permission.EXPENSES_EDIT);
  const canDelete = hasPermission(userPermissions, Permission.EXPENSES_DELETE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gider İşleme</h1>
          <p className="text-muted-foreground">
            Gider kayıtlarını görüntüleyin ve yönetin
          </p>
        </div>
        {canCreate && (
          <ExpenseDialog expenseItems={expenseItems}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Gider
            </Button>
          </ExpenseDialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} kayıt
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gider Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                Yükleniyor...
              </div>
            }
          >
            <ExpensesTable
              data={formattedExpenses}
              expenseItems={expenseItems}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
