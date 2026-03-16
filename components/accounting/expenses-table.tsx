"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseDialog } from "./expense-dialog";
import { deleteExpenseAction } from "@/lib/actions/expenses";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpensesTableProps {
  data: Array<{
    id: string;
    date: Date;
    expenseItemName: string;
    amount: number;
    paymentMethod: string;
    invoiceNumber: string;
    createdByName: string;
    description: string | null;
    expenseItemId: string;
  }>;
  expenseItems: Array<{ id: string; name: string }>;
  canEdit: boolean;
  canDelete: boolean;
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Nakit",
  BANK_TRANSFER: "Banka Transferi",
  CREDIT_CARD: "Kredi Kartı",
};

export function ExpensesTable({
  data,
  expenseItems,
  canEdit,
  canDelete,
}: ExpensesTableProps) {
  const handleDelete = async (id: string) => {
    const result = await deleteExpenseAction(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Henüz gider kaydı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Gider Kalemi</TableHead>
            <TableHead className="text-right">Tutar</TableHead>
            <TableHead>Ödeme Yöntemi</TableHead>
            <TableHead>Fatura No</TableHead>
            <TableHead>Oluşturan</TableHead>
            {(canEdit || canDelete) && (
              <TableHead className="text-right">İşlemler</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell className="font-medium">
                {expense.expenseItemName}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                {paymentMethodLabels[expense.paymentMethod] ||
                  expense.paymentMethod}
              </TableCell>
              <TableCell>{expense.invoiceNumber}</TableCell>
              <TableCell>{expense.createdByName}</TableCell>
              {(canEdit || canDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canEdit && (
                      <ExpenseDialog
                        expense={{
                          id: expense.id,
                          expenseItemId: expense.expenseItemId,
                          amount: expense.amount,
                          date: expense.date,
                          description: expense.description,
                          paymentMethod: expense.paymentMethod,
                          invoiceNumber: expense.invoiceNumber === "-" ? null : expense.invoiceNumber,
                        }}
                        expenseItems={expenseItems}
                      >
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </ExpenseDialog>
                    )}
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu gider kaydını silmek istediğinizden emin misiniz?
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(expense.id)}
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
