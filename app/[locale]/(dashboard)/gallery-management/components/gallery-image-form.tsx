"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import type { GalleryImage } from "@prisma/client";

interface GalleryImageFormProps {
  image?: GalleryImage;
  dealerId: string;
  locale: string;
}

export function GalleryImageForm({ image, dealerId, locale }: GalleryImageFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");
  const [formData, setFormData] = useState({
    url: image?.url || "",
    title: image?.title || "",
    description: image?.description || "",
    sortOrder: image?.sortOrder || 0,
    isActive: image?.isActive ?? true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload/gallery", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();
      setFormData({ ...formData, url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Görsel yüklenirken bir hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url) {
      alert("Lütfen bir görsel yükleyin veya URL girin");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = image
        ? `/api/gallery/${image.id}`
        : "/api/gallery";

      const method = image ? "PATCH" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: formData.title || null,
          description: formData.description || null,
          dealerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save gallery image");
      }

      router.push(`/${locale}/gallery-management`);
      router.refresh();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Fotoğraf kaydedilirken bir hata oluştu"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{image ? "Fotoğraf Düzenle" : "Yeni Fotoğraf Ekle"}</CardTitle>
          <CardDescription>
            Galeri sayfasında gösterilecek fotoğraf bilgilerini girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Görsel</Label>
            <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as "upload" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Dosya Yükle</TabsTrigger>
                <TabsTrigger value="url">URL Gir</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="flex flex-col gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />

                  {!formData.url ? (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Tıklayarak</span> görsel yükleyin
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, WEBP (Max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  ) : (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                      <Image
                        src={formData.url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <Input
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.url && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Başlık (Opsiyonel)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Fotoğraf başlığı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Fotoğraf açıklaması"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sıralama</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Küçük sayılar önce gösterilir
            </p>
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/gallery-management`)}
            >
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
