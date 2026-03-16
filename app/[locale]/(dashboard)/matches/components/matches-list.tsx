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
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
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
import { deleteMatch, toggleMatchVisibility } from "@/lib/actions/matches";
import { toast } from "sonner";
import type { Match } from "@prisma/client";

interface MatchesListProps {
  matches: Match[];
  locale: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: "Yaklaşan",
  LIVE: "Canlı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UPCOMING: "outline",
  LIVE: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

const MATCH_TYPE_LABELS: Record<string, string> = {
  HOME: "Ev",
  AWAY: "Deplasman",
  NEUTRAL: "Tarafsız",
};

export function MatchesList({ matches, locale, canEdit = true, canDelete = true }: MatchesListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await deleteMatch(id);
      if (result.success) {
        toast.success("Maç silindi");
        router.refresh();
      } else {
        toast.error("Maç silinemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await toggleMatchVisibility(id);
      if (result.success) {
        toast.success(result.isVisible ? "Maç görünür yapıldı" : "Maç gizlendi");
        router.refresh();
      } else {
        toast.error("Görünürlük güncellenemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoadingId(null);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Henüz maç eklenmemiş. Yeni bir maç eklemek için yukarıdaki butonu kullanın.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Maç</TableHead>
            <TableHead>Lig / Organizasyon</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Görünürlük</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="whitespace-nowrap text-sm">
                {new Date(match.matchDate).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                <div className="text-xs text-muted-foreground">
                  {new Date(match.matchDate).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {match.homeTeam} - {match.awayTeam}
                </div>
                {(match.homeScore !== null && match.awayScore !== null) && (
                  <div className="text-sm text-muted-foreground">
                    Skor: {match.homeScore} - {match.awayScore}
                  </div>
                )}
                {match.venue && (
                  <div className="text-xs text-muted-foreground">{match.venue}</div>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{match.competition || "-"}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {MATCH_TYPE_LABELS[match.matchType] || match.matchType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[match.status] || "secondary"}>
                  {STATUS_LABELS[match.status] || match.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingId === match.id}
                  onClick={() => handleToggleVisibility(match.id)}
                  title={match.isVisible ? "Gizle" : "Görünür yap"}
                >
                  {match.isVisible ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canEdit && (
                    <Link href={`/${locale}/matches/${match.id}/edit`}>
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
                        disabled={loadingId === match.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{match.homeTeam} - {match.awayTeam}</strong> maçı kalıcı
                          olarak silinecektir. Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(match.id)}
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
