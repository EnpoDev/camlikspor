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
import type { HeroSlide } from "@prisma/client";

interface HeroSlideFormProps {
  slide?: HeroSlide;
  dealerId: string;
  locale: string;
}

export function HeroSlideForm({ slide, dealerId, locale }: HeroSlideFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");
  const [formData, setFormData] = useState({
    image: slide?.image || "",
    badge: slide?.badge || "YENİ",
    title: slide?.title || "",
    titleColor: slide?.titleColor || "#dc2626",
    subtitle: slide?.subtitle || "",
    ctaPrimary: slide?.ctaPrimary || "Kayıt Ol",
    ctaPrimaryUrl: slide?.ctaPrimaryUrl || "/contact",
    ctaSecondary: slide?.ctaSecondary || "Hakkımızda",
    ctaSecondaryUrl: slide?.ctaSecondaryUrl || "#about",
    showCtaPrimary: slide?.showCtaPrimary ?? true,
    showCtaSecondary: slide?.showCtaSecondary ?? true,
    sortOrder: slide?.sortOrder || 0,
    isActive: slide?.isActive ?? true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload/hero-slides", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();
      setFormData({ ...formData, image: url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Görsel yüklenirken bir hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Lütfen bir görsel yükleyin veya URL girin");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = slide
        ? `/api/hero-slides/${slide.id}`
        : "/api/hero-slides";

      const method = slide ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dealerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to save hero slide");
      }

      router.push(`/${locale}/hero-slides`);
      router.refresh();
    } catch (error) {
      console.error("Error saving hero slide:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Slider kaydedilirken bir hata oluştu"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{slide ? "Slider Düzenle" : "Yeni Slider Ekle"}</CardTitle>
          <CardDescription>
            Ana sayfada gösterilecek slider bilgilerini girin
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

                  {!formData.image ? (
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
                        src={formData.image}
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
                  id="image-url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground">
              Slider arka plan görseli (min. 1920x1080 önerilir)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Rozet Metni</Label>
            <Input
              id="badge"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
              placeholder="YENİ"
              required
            />
            <p className="text-xs text-muted-foreground">
              Slider üzerindeki küçük etiket metni (ör: YENİ, KAMPANYA)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Profesyonel Futbol Akademisi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleColor">Başlık Rengi</Label>
            <div className="flex gap-3 items-center">
              <Input
                id="titleColor"
                type="color"
                value={formData.titleColor}
                onChange={(e) =>
                  setFormData({ ...formData, titleColor: e.target.value })
                }
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.titleColor}
                onChange={(e) =>
                  setFormData({ ...formData, titleColor: e.target.value })
                }
                placeholder="#dc2626"
                className="flex-1 font-mono"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, titleColor: "#dc2626" })}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: "#dc2626" }}
                  title="Yeşil"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, titleColor: "#3b82f6" })}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: "#3b82f6" }}
                  title="Mavi"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, titleColor: "#ef4444" })}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: "#ef4444" }}
                  title="Kırmızı"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, titleColor: "#ffffff" })}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: "#ffffff" }}
                  title="Beyaz"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Başlık metninin rengi (hex kodu: #dc2626)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Alt Başlık</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="Geleceğin yıldızlarını yetiştiriyoruz..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="showCtaPrimary" className="font-semibold">
                  Birincil Buton
                </Label>
                <Switch
                  id="showCtaPrimary"
                  checked={formData.showCtaPrimary}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showCtaPrimary: checked })
                  }
                />
              </div>
              {formData.showCtaPrimary && (
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="ctaPrimary" className="text-sm text-muted-foreground">
                      Buton Metni
                    </Label>
                    <Input
                      id="ctaPrimary"
                      value={formData.ctaPrimary}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaPrimary: e.target.value })
                      }
                      placeholder="Kayıt Ol"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaPrimaryUrl" className="text-sm text-muted-foreground">
                      Yönlendirme URL'i
                    </Label>
                    <Input
                      id="ctaPrimaryUrl"
                      value={formData.ctaPrimaryUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaPrimaryUrl: e.target.value })
                      }
                      placeholder="#contact, /kayit, https://example.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Sayfa içi bağlantı (#contact) veya tam URL kullanabilirsiniz
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="showCtaSecondary" className="font-semibold">
                  İkincil Buton
                </Label>
                <Switch
                  id="showCtaSecondary"
                  checked={formData.showCtaSecondary}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showCtaSecondary: checked })
                  }
                />
              </div>
              {formData.showCtaSecondary && (
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="ctaSecondary" className="text-sm text-muted-foreground">
                      Buton Metni
                    </Label>
                    <Input
                      id="ctaSecondary"
                      value={formData.ctaSecondary}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaSecondary: e.target.value })
                      }
                      placeholder="Hakkımızda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaSecondaryUrl" className="text-sm text-muted-foreground">
                      Yönlendirme URL'i
                    </Label>
                    <Input
                      id="ctaSecondaryUrl"
                      value={formData.ctaSecondaryUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaSecondaryUrl: e.target.value })
                      }
                      placeholder="#about, /hakkimizda, https://example.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Sayfa içi bağlantı (#about) veya tam URL kullanabilirsiniz
                    </p>
                  </div>
                </div>
              )}
            </div>
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
              required
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
              onClick={() => router.push(`/${locale}/hero-slides`)}
            >
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
