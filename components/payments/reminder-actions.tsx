"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, AlertTriangle, Clock, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  sendOverdueReminders,
  sendUpcomingReminders,
} from "@/lib/actions/payment-reminders";

interface ReminderStats {
  overdue: number;
  upcoming: number;
  overdueAmount: number;
  upcomingAmount: number;
}

interface Props {
  stats: ReminderStats;
}

export function PaymentReminderActions({ stats }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOverdueDialog, setShowOverdueDialog] = useState(false);
  const [showUpcomingDialog, setShowUpcomingDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSendOverdueReminders = async () => {
    setIsLoading(true);
    try {
      const result = await sendOverdueReminders();
      if (result.success) {
        toast.success(result.message);
        setShowOverdueDialog(false);
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

  const handleSendUpcomingReminders = async () => {
    setIsLoading(true);
    try {
      const result = await sendUpcomingReminders(3);
      if (result.success) {
        toast.success(result.message);
        setShowUpcomingDialog(false);
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Overdue Payments Card */}
      <Card className={stats.overdue > 0 ? "border-red-200 bg-red-50" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle
              className={`h-4 w-4 ${stats.overdue > 0 ? "text-red-500" : "text-muted-foreground"}`}
            />
            Gecikmiş Ödemeler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overdue}</div>
          <p className="text-sm text-muted-foreground mb-4">
            {formatCurrency(stats.overdueAmount)} toplam
          </p>
          <Dialog open={showOverdueDialog} onOpenChange={setShowOverdueDialog}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant={stats.overdue > 0 ? "destructive" : "outline"}
                disabled={stats.overdue === 0}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS Hatırlatma Gönder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gecikmiş Ödeme Hatırlatması</DialogTitle>
                <DialogDescription>
                  {stats.overdue} kişiye gecikmiş ödeme hatırlatması SMS
                  gönderilecek. Toplam tutar: {formatCurrency(stats.overdueAmount)}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowOverdueDialog(false)}
                >
                  İptal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSendOverdueReminders}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  SMS Gönder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Upcoming Payments Card */}
      <Card className={stats.upcoming > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock
              className={`h-4 w-4 ${stats.upcoming > 0 ? "text-yellow-600" : "text-muted-foreground"}`}
            />
            Yaklaşan Ödemeler (3 gün)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcoming}</div>
          <p className="text-sm text-muted-foreground mb-4">
            {formatCurrency(stats.upcomingAmount)} toplam
          </p>
          <Dialog open={showUpcomingDialog} onOpenChange={setShowUpcomingDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={stats.upcoming === 0}>
                <Bell className="mr-2 h-4 w-4" />
                Ön Hatırlatma Gönder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yaklaşan Ödeme Hatırlatması</DialogTitle>
                <DialogDescription>
                  {stats.upcoming} kişiye yaklaşan ödeme hatırlatması SMS
                  gönderilecek. Toplam tutar: {formatCurrency(stats.upcomingAmount)}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowUpcomingDialog(false)}
                >
                  İptal
                </Button>
                <Button onClick={handleSendUpcomingReminders} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  SMS Gönder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
