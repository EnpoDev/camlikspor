"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { deleteSponsor } from "@/lib/actions/sponsors";
import { toast } from "sonner";
import type { Sponsor } from "@prisma/client";

interface SponsorsListProps {
  sponsors: Sponsor[];
  locale: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

const TIER_LABELS: Record<string, string> = {
  main: "Ana Sponsor",
  official: "Resmi Sponsor",
  partner: "İş Ortağı",
};

const TIER_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  main: "default",
  official: "secondary",
  partner: "outline",
};

export function SponsorsList({ sponsors, locale, canEdit = true, canDelete = true }: SponsorsListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await deleteSponsor(id);
      if (result.success) {
        toast.success("Sponsor silindi");
        router.refresh();
      } else {
        toast.error("Sponsor silinemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoadingId(null);
    }
  };

  if (sponsors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Henüz sponsor eklenmemiş. Yeni bir sponsor eklemek için yukarıdaki butonu kullanın.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Sponsor Adı</TableHead>
            <TableHead>Seviye</TableHead>
            <TableHead>Sıra</TableHead>
            <TableHead>Web Sitesi</TableHead>
            <TableHead>Görünürlük</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell>
                <div className="relative h-12 w-20 overflow-hidden rounded border bg-white flex items-center justify-center p-1">
                  {sponsor.logoUrl ? (
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Logo yok</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{sponsor.name}</span>
              </TableCell>
              <TableCell>
                <Badge variant={TIER_VARIANTS[sponsor.tier] || "outline"}>
                  {TIER_LABELS[sponsor.tier] || sponsor.tier}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{sponsor.sortOrder}</span>
              </TableCell>
              <TableCell>
                {sponsor.websiteUrl ? (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ziyaret Et
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {sponsor.isVisible ? (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Görünür</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Gizli</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canEdit && (
                    <Link href={`/${locale}/sponsors/${sponsor.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {canDelete && (<AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={loadingId === sponsor.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{sponsor.name}</strong> sponsoru kalıcı olarak
                          silinecektir. Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(sponsor.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
