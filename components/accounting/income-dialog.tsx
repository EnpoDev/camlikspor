"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createIncomeAction,
  updateIncomeAction,
  type IncomeFormState,
} from "@/lib/actions/incomes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface IncomeDialogProps {
  children: React.ReactNode;
  income?: {
    id: string;
    incomeItemId: string;
    amount: number;
    date: Date;
    description: string | null;
    paymentMethod: string;
    receiptNumber: string | null;
  };
  incomeItems: Array<{ id: string; name: string }>;
}

const initialState: IncomeFormState = {
  errors: {},
  message: "",
  success: false,
};

export function IncomeDialog({
  children,
  income,
  incomeItems,
}: IncomeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const action = income
    ? updateIncomeAction.bind(null, income.id)
    : createIncomeAction;

  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      setIsPending(false);
    } else if (state.message && !state.success) {
      toast.error(state.message);
      setIsPending(false);
    }
  }, [state]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {income ? "Gelir Düzenle" : "Yeni Gelir"}
          </DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            setIsPending(true);
            formAction(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="incomeItemId">
              Gelir Kalemi <span className="text-red-500">*</span>
            </Label>
            <Select
              name="incomeItemId"
              defaultValue={income?.incomeItemId || ""}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Gelir kalemi seçin" />
              </SelectTrigger>
              <SelectContent>
                {incomeItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.incomeItemId && (
              <p className="text-sm text-red-500">
                {state.errors.incomeItemId[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Tutar (₺) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={income?.amount || ""}
              placeholder="0.00"
              required
            />
            {state.errors?.amount && (
              <p className="text-sm text-red-500">{state.errors.amount[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              Tarih <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={
                income ? formatDateForInput(income.date) : formatDateForInput(new Date())
              }
              max={formatDateForInput(new Date())}
              required
            />
            {state.errors?.date && (
              <p className="text-sm text-red-500">{state.errors.date[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Ödeme Yöntemi <span className="text-red-500">*</span>
            </Label>
            <Select
              name="paymentMethod"
              defaultValue={income?.paymentMethod || "CASH"}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Ödeme yöntemi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Nakit</SelectItem>
                <SelectItem value="BANK_TRANSFER">Banka Transferi</SelectItem>
                <SelectItem value="CREDIT_CARD">Kredi Kartı</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.paymentMethod && (
              <p className="text-sm text-red-500">
                {state.errors.paymentMethod[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiptNumber">Makbuz No</Label>
            <Input
              id="receiptNumber"
              name="receiptNumber"
              defaultValue={income?.receiptNumber || ""}
              placeholder="Makbuz numarası (opsiyonel)"
            />
            {state.errors?.receiptNumber && (
              <p className="text-sm text-red-500">
                {state.errors.receiptNumber[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={income?.description || ""}
              placeholder="Açıklama (opsiyonel)"
              rows={3}
            />
            {state.errors?.description && (
              <p className="text-sm text-red-500">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {income ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
