"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Upload, Trash2, Edit, Plus, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface LegalDocument {
  id: string;
  title: string;
  slug: string;
  fileUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function LegalDocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    fileUrl: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/legal-documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      toast.error("Dökümanlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Sadece PDF dosyaları yükleyebilirsiniz");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, fileUrl: data.url }));
      toast.success("Dosya başarıyla yüklendi");
    } catch (error) {
      toast.error("Dosya yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.fileUrl) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      const url = editingDoc
        ? `/api/legal-documents/${editingDoc.id}`
        : "/api/legal-documents";
      const method = editingDoc ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save document");

      toast.success(
        editingDoc ? "Döküman güncellendi" : "Döküman oluşturuldu"
      );

      setShowDialog(false);
      setEditingDoc(null);
      setFormData({
        title: "",
        slug: "",
        fileUrl: "",
        isActive: true,
        sortOrder: 0,
      });
      fetchDocuments();
    } catch (error) {
      toast.error("Döküman kaydedilirken bir hata oluştu");
    }
  };

  const handleEdit = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      slug: doc.slug,
      fileUrl: doc.fileUrl,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dökümanı silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/legal-documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete document");

      toast.success("Döküman silindi");
      fetchDocuments();
    } catch (error) {
      toast.error("Döküman silinirken bir hata oluştu");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yasal Dökümanlar</h1>
          <p className="text-muted-foreground mt-1">
            Sporcu sözleşmesi ve diğer yasal dökümanları yönetin
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingDoc(null);
            setFormData({
              title: "",
              slug: "",
              fileUrl: "",
              isActive: true,
              sortOrder: 0,
            });
            setShowDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Döküman
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Döküman Listesi</CardTitle>
          <CardDescription>
            Footer'da gösterilecek yasal dökümanlar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz döküman eklenmemiş</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Dosya</TableHead>
                  <TableHead>Aktif</TableHead>
                  <TableHead>Sıra</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.slug}
                    </TableCell>
                    <TableCell>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        PDF <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {doc.isActive ? (
                        <span className="text-green-600">✓ Aktif</span>
                      ) : (
                        <span className="text-gray-400">✗ Pasif</span>
                      )}
                    </TableCell>
                    <TableCell>{doc.sortOrder}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingDoc ? "Döküman Düzenle" : "Yeni Döküman Ekle"}
            </DialogTitle>
            <DialogDescription>
              Döküman bilgilerini girin ve PDF dosyasını yükleyin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                placeholder="Sporcu Sözleşmesi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="sporcu-sozlesmesi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">PDF Dosyası</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Yükleniyor...</span>}
              </div>
              {formData.fileUrl && (
                <p className="text-sm text-green-600">✓ Dosya yüklendi</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sıra</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={uploading || !formData.fileUrl}>
                {editingDoc ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
