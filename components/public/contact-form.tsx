"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ContactFormProps {
  dealerId: string;
}

export function ContactForm({ dealerId }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      dealerId,
      parentName: formData.get("parentName") as string,
      studentName: formData.get("studentName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      studentAge: formData.get("studentAge") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/public/pre-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Bir hata oluştu");
      }

      setIsSuccess(true);
      toast.success("Başvurunuz alındı! En kısa sürede sizinle iletişime geçeceğiz.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Başvurunuz Alındı!</h3>
        <p className="text-muted-foreground mb-6">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Yeni Başvuru
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          name="parentName"
          placeholder="Veli Adı Soyadı *"
          className="bg-slate-50 dark:bg-slate-800 border-0 h-12"
          required
          disabled={isLoading}
        />
        <Input
          name="studentName"
          placeholder="Öğrenci Adı Soyadı *"
          className="bg-slate-50 dark:bg-slate-800 border-0 h-12"
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input
          name="phone"
          type="tel"
          placeholder="Telefon *"
          className="bg-slate-50 dark:bg-slate-800 border-0 h-12"
          required
          disabled={isLoading}
        />
        <Input
          name="email"
          type="email"
          placeholder="E-posta"
          className="bg-slate-50 dark:bg-slate-800 border-0 h-12"
          disabled={isLoading}
        />
        <Input
          name="studentAge"
          placeholder="Öğrenci Yaşı *"
          className="bg-slate-50 dark:bg-slate-800 border-0 h-12"
          required
          disabled={isLoading}
        />
      </div>
      <Textarea
        name="message"
        placeholder="Mesajınız (varsa)"
        rows={4}
        className="bg-slate-50 dark:bg-slate-800 border-0 resize-none"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Kayıt Başvurusu Gönder
          </>
        )}
      </Button>
    </form>
  );
}
