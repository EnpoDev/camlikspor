"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Shield } from "lucide-react";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut sifre gerekli"),
  newPassword: z.string().min(8, "Yeni sifre en az 8 karakter olmali"),
  confirmPassword: z.string().min(1, "Sifre onay gerekli"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Sifreler eslesmiyor",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/parent/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Sifre degistirilemedi");
        return;
      }

      toast.success("Sifre basariyla degistirildi!");
      router.push("/tr/parent/parent");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Sifre Degistir</CardTitle>
          <CardDescription>
            Guvenliginiz icin ilk girisde sifrenizi degistirmeniz gerekiyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Sifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Mevcut sifreniz"
                  className="pl-10"
                  {...register("currentPassword")}
                  disabled={isLoading}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Sifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Yeni sifreniz (en az 8 karakter)"
                  className="pl-10"
                  {...register("newPassword")}
                  disabled={isLoading}
                />
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Sifre Tekrar</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Yeni sifrenizi tekrar girin"
                  className="pl-10"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Degistiriliyor..." : "Sifre Degistir"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
