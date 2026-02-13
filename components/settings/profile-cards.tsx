"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Building2,
  Mail,
  Phone,
  Shield,
  Clock,
  CalendarDays,
  Activity,
  Pencil,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Platform Yoneticisi",
  DEALER_ADMIN: "Okul Yoneticisi",
  TRAINER: "Egitmen",
};

interface ProfileCardsProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    dealer: { id: string; name: string; isActive: boolean } | null;
  };
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDateOnly(date: Date | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function ProfileCards({ user }: ProfileCardsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");

  // Display values (update after successful save)
  const [displayName, setDisplayName] = useState(user.name);
  const [displayPhone, setDisplayPhone] = useState(user.phone || "");

  const handleCancel = () => {
    setName(displayName);
    setPhone(displayPhone);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Ad en az 2 karakter olmali");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() || null }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Profil guncellenemedi");
      }

      setDisplayName(name.trim());
      setDisplayPhone(phone.trim());
      setIsEditing(false);
      toast.success("Profil basariyla guncellendi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata olustu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Kisisel Bilgiler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Kisisel Bilgiler
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Duzenle
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Iptal
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  Kaydet
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Ad Soyad</p>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{displayName}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">E-posta</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Telefon</p>
              {isEditing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon numarasi"
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{displayPhone || "-"}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rol</p>
              <Badge variant="secondary">
                {roleLabels[user.role] || user.role}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Son Giris</p>
              <p className="font-medium">{formatDate(user.lastLoginAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kurumsal Bilgiler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Kurumsal Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Futbol Okulu</p>
              <p className="font-medium">
                {user.dealer ? user.dealer.name : "Platform Yoneticisi"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Durum</p>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Kayit Tarihi</p>
              <p className="font-medium">{formatDateOnly(user.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
