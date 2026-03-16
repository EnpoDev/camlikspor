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
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { HeroSlide } from "@prisma/client";
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

interface HeroSlidesListProps {
  slides: HeroSlide[];
  locale: string;
}

export function HeroSlidesList({ slides, locale }: HeroSlidesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete hero slide");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      alert("Slider silinirken bir hata oluştu");
    } finally {
      setDeletingId(null);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Henüz hero slider eklenmemiş. Yeni bir slider eklemek için yukarıdaki
          butonu kullanın.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Görsel</TableHead>
            <TableHead>Başlık</TableHead>
            <TableHead>Rozet</TableHead>
            <TableHead>Sıra</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide) => (
            <TableRow key={slide.id}>
              <TableCell>
                <div className="relative h-16 w-24 overflow-hidden rounded bg-muted">
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{slide.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {slide.subtitle}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{slide.badge}</Badge>
              </TableCell>
              <TableCell>{slide.sortOrder}</TableCell>
              <TableCell>
                {slide.isActive ? (
                  <Badge variant="default">Aktif</Badge>
                ) : (
                  <Badge variant="secondary">Pasif</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/${locale}/hero-slides/${slide.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === slide.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu slider kalıcı olarak silinecektir. Bu işlem geri
                          alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(slide.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
