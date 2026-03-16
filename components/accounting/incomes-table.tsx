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
import { IncomeDialog } from "./income-dialog";
import { deleteIncomeAction } from "@/lib/actions/incomes";
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

interface IncomesTableProps {
  data: Array<{
    id: string;
    date: Date;
    incomeItemName: string;
    amount: number;
    paymentMethod: string;
    receiptNumber: string;
    createdByName: string;
    description: string | null;
    incomeItemId: string;
  }>;
  incomeItems: Array<{ id: string; name: string }>;
  canEdit: boolean;
  canDelete: boolean;
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Nakit",
  BANK_TRANSFER: "Banka Transferi",
  CREDIT_CARD: "Kredi Kartı",
};

export function IncomesTable({
  data,
  incomeItems,
  canEdit,
  canDelete,
}: IncomesTableProps) {
  const handleDelete = async (id: string) => {
    const result = await deleteIncomeAction(id);
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
        Henüz gelir kaydı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Gelir Kalemi</TableHead>
            <TableHead className="text-right">Tutar</TableHead>
            <TableHead>Ödeme Yöntemi</TableHead>
            <TableHead>Makbuz No</TableHead>
            <TableHead>Oluşturan</TableHead>
            {(canEdit || canDelete) && (
              <TableHead className="text-right">İşlemler</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((income) => (
            <TableRow key={income.id}>
              <TableCell>{formatDate(income.date)}</TableCell>
              <TableCell className="font-medium">
                {income.incomeItemName}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(income.amount)}
              </TableCell>
              <TableCell>
                {paymentMethodLabels[income.paymentMethod] ||
                  income.paymentMethod}
              </TableCell>
              <TableCell>{income.receiptNumber}</TableCell>
              <TableCell>{income.createdByName}</TableCell>
              {(canEdit || canDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canEdit && (
                      <IncomeDialog
                        income={{
                          id: income.id,
                          incomeItemId: income.incomeItemId,
                          amount: income.amount,
                          date: income.date,
                          description: income.description,
                          paymentMethod: income.paymentMethod,
                          receiptNumber: income.receiptNumber === "-" ? null : income.receiptNumber,
                        }}
                        incomeItems={incomeItems}
                      >
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </IncomeDialog>
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
                              Bu gelir kaydını silmek istediğinizden emin misiniz?
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(income.id)}
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
