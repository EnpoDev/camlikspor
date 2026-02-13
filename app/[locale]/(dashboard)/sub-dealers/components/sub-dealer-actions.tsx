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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteSubDealerAction } from "@/lib/actions/sub-dealers";

interface SubDealerActionsProps {
  subDealerId: string;
  subDealerName: string;
  locale: string;
}

const deleteErrorMessages: Record<string, string> = {
  hasSubDealers: "Bu alt bayinin alt bayileri var, once onlari kaldirin",
  hasOrders: "Bu alt bayinin siparisleri var, silinemez",
  notFound: "Alt bayi bulunamadi",
  authError: "Yetkisiz islem",
  deleteError: "Silme islemi sirasinda bir hata olustu",
};

export function SubDealerActions({
  subDealerId,
  subDealerName,
  locale,
}: SubDealerActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSubDealerAction(subDealerId);
      if (result.success) {
        toast.success("Alt bayi basariyla kaldirildi");
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(
          deleteErrorMessages[result.messageKey] || "Bir hata olustu"
        );
      }
    } catch {
      toast.error("Bir hata olustu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Islemler</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/sub-dealers/${subDealerId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Goruntule
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/sub-dealers/${subDealerId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Duzenle
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Kaldir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alt Bayiyi Kaldir</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{subDealerName}</strong> alt bayisini kaldirmak
              istediginizden emin misiniz? Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Iptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaldir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
