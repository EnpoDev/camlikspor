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
import {
  MoreHorizontal,
  Eye,
  Edit,
  ClipboardList,
  Users,
  Banknote,
  Copy,
  MessageSquare,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { copyGroupAction, deleteGroupAction } from "@/lib/actions/groups";

interface GroupActionsProps {
  groupId: string;
  groupName: string;
  locale: string;
  dictionary: Record<string, unknown>;
}

export function GroupActions({
  groupId,
  groupName,
  locale,
  dictionary,
}: GroupActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const result = await copyGroupAction(groupId);
      if (result.success) {
        toast.success(result.message);
        setShowCopyDialog(false);
        if (result.newGroupId) {
          router.push(`/${locale}/groups/${result.newGroupId}/edit`);
        }
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata olustu");
    } finally {
      setIsCopying(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteGroupAction(groupId);
      if (result.success) {
        toast.success(result.message);
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(result.message);
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
          <Button variant="ghost" size="icon" disabled={isDeleting || isCopying}>
            {(isDeleting || isCopying) ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/groups/${groupId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Goruntule
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/groups/${groupId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              {(dictionary.common as Record<string, string>).edit}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/attendance/new?groupId=${groupId}`}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Yoklama Al
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/groups/${groupId}/students`}>
              <Users className="mr-2 h-4 w-4" />
              Ogrenciler
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/groups/${groupId}/payments`}>
              <Banknote className="mr-2 h-4 w-4" />
              Aidatlar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCopyDialog(true)}>
            <Copy className="mr-2 h-4 w-4" />
            Kopyala
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/groups/${groupId}/sms`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS Gonder
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Copy Dialog */}
      <AlertDialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Grubu Kopyala</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{groupName}&quot; grubu kopyalanacak. Program ve antrenor
              bilgileri de kopyalanacaktir. Ogrenciler kopyalanmayacaktir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCopying}>Iptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleCopy} disabled={isCopying}>
              {isCopying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kopyala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Grubu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{groupName}&quot; grubunu silmek istediginize emin misiniz?
              Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Iptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
