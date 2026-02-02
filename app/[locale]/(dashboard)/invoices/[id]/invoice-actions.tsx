"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Send,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/actions/invoices";

interface Invoice {
  id: string;
  invoiceNo: string;
  status: string;
  total: number;
}

interface Props {
  invoice: Invoice;
  locale: string;
}

export function InvoiceActions({ invoice, locale }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paidAmount, setPaidAmount] = useState(String(invoice.total));

  const handleStatusUpdate = async (status: string) => {
    setIsLoading(true);
    try {
      const result = await updateInvoiceStatus(invoice.id, status);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setIsLoading(true);
    try {
      const result = await updateInvoiceStatus(invoice.id, "PAID", {
        paidAmount: parseFloat(paidAmount),
        paymentMethod,
      });
      if (result.success) {
        toast.success("Fatura ödendi olarak işaretlendi");
        setShowPayDialog(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteInvoice(invoice.id);
      if (result.success) {
        toast.success(result.message);
        router.push(`/${locale}/invoices`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const paymentMethods = [
    { value: "CASH", label: "Nakit" },
    { value: "CREDIT_CARD", label: "Kredi Kartı" },
    { value: "BANK_TRANSFER", label: "Havale/EFT" },
    { value: "ONLINE_PAYTR", label: "Online Ödeme" },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {invoice.status === "DRAFT" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("SENT")}>
              <Send className="mr-2 h-4 w-4" />
              Gönderildi Olarak İşaretle
            </DropdownMenuItem>
          )}
          {(invoice.status === "DRAFT" || invoice.status === "SENT") && (
            <DropdownMenuItem onClick={() => setShowPayDialog(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Ödendi Olarak İşaretle
            </DropdownMenuItem>
          )}
          {invoice.status !== "CANCELLED" && invoice.status !== "PAID" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("CANCELLED")}>
              <XCircle className="mr-2 h-4 w-4" />
              İptal Et
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {invoice.status !== "PAID" && (
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pay Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ödeme Bilgileri</DialogTitle>
            <DialogDescription>
              Fatura #{invoice.invoiceNo} için ödeme bilgilerini girin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Ödeme Yöntemi</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ödenen Tutar (TL)</Label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleMarkPaid} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ödendi Olarak İşaretle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faturayı Sil</DialogTitle>
            <DialogDescription>
              Fatura #{invoice.invoiceNo} silinecek. Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
