"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteDealerAction } from "@/lib/actions/dealers";

interface DeleteDealerCardProps {
  dealerId: string;
  dealerName: string;
  locale: string;
}

export function DeleteDealerCard({ dealerId, dealerName, locale }: DeleteDealerCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDealerAction(dealerId);
      if (result.success) {
        toast.success(result.message);
        router.push(`/${locale}/dealers`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata olustu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Tehlikeli Bolge
          </CardTitle>
          <CardDescription>
            Bu islemler geri alinamaz. Dikkatli olun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
            <div>
              <div className="font-medium">Bayiyi Sil</div>
              <div className="text-sm text-muted-foreground">
                Bu bayi ve tum iliskili veriler kalici olarak silinecektir.
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Bayiyi Sil
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bayiyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{dealerName}</strong> bayisini silmek istediginizden emin misiniz?
              <br /><br />
              Bu islem geri alinamaz ve bayiye ait tum veriler (kullanicilar, ogrenciler, odemeler vb.) silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Iptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
