"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Message {
  id: string;
  senderType: "PARENT" | "ADMIN";
  senderName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

type View = "inbox" | "compose";

export default function ParentMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/parent/messages");
      if (!res.ok) throw new Error("Mesajlar yuklenemedi");
      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Mesajlar yuklenirken bir hata olustu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await fetch(`/api/parent/messages/${msg.id}/read`, { method: "PATCH" });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch {
        // Non-critical — ignore read-mark failure
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!subject.trim() || !content.trim()) {
      setError("Konu ve icerik gereklidir");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/parent/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Mesaj gonderilemedi");
        return;
      }

      setSuccess("Mesajiniz basariyla gonderildi");
      setSubject("");
      setContent("");
      setMessages((prev) => [data, ...prev]);
      setTimeout(() => {
        setView("inbox");
        setSuccess(null);
      }, 1500);
    } catch {
      setError("Mesaj gonderilirken bir hata olustu");
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mesajlar</h1>
          <p className="text-muted-foreground">Okul yonetimiyle iletisime gecin</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "inbox" ? "default" : "outline"}
            onClick={() => {
              setView("inbox");
              setSelectedMessage(null);
            }}
            className="font-bold uppercase text-xs tracking-wide"
          >
            Gelen Kutusu
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-600 text-white text-xs px-1.5 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={view === "compose" ? "default" : "outline"}
            onClick={() => {
              setView("compose");
              setSelectedMessage(null);
              setError(null);
              setSuccess(null);
            }}
            className="font-bold uppercase text-xs tracking-wide bg-orange-600 hover:bg-orange-700 text-white border-0"
          >
            Yeni Mesaj
          </Button>
        </div>
      </div>

      {/* Inbox View */}
      {view === "inbox" && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Message List */}
          <Card className="shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Mesajlar ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-10 text-muted-foreground">
                  Yukleniyor...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-5xl mb-3 select-none">&#9993;</div>
                  <p className="font-semibold text-muted-foreground">
                    Henuz mesajiniz bulunmuyor
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Okul yonetimiyle iletisime gecmek icin yeni mesaj gonderin
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {messages.map((msg) => (
                    <li
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedMessage?.id === msg.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {!msg.isRead ? (
                          <span className="block w-2.5 h-2.5 rounded-full bg-orange-500" />
                        ) : (
                          <span className="block w-2.5 h-2.5 rounded-full bg-transparent border border-muted-foreground/30" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm truncate ${
                              !msg.isRead ? "font-bold" : "font-medium"
                            }`}
                          >
                            {msg.subject}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {format(new Date(msg.createdAt), "dd MMM", {
                              locale: tr,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant={
                              msg.senderType === "ADMIN" ? "default" : "secondary"
                            }
                            className={`text-xs px-1.5 py-0 ${
                              msg.senderType === "ADMIN"
                                ? "bg-blue-600 text-white"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {msg.senderType === "ADMIN" ? "Yonetim" : "Siz"}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">
                            {msg.senderName}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="shadow-md">
            {selectedMessage ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold leading-snug">
                      {selectedMessage.subject}
                    </CardTitle>
                    <Badge
                      className={`shrink-0 text-xs ${
                        selectedMessage.senderType === "ADMIN"
                          ? "bg-blue-600 text-white"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {selectedMessage.senderType === "ADMIN" ? "Yonetim" : "Siz"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{selectedMessage.senderName}</span>
                    {" · "}
                    {format(
                      new Date(selectedMessage.createdAt),
                      "dd MMMM yyyy, HH:mm",
                      { locale: tr }
                    )}
                  </p>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[240px] text-muted-foreground">
                <div className="text-4xl mb-3 select-none">&#128172;</div>
                <p className="text-sm font-medium">
                  Detaylari gormek icin bir mesaj secin
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Compose View */}
      {view === "compose" && (
        <Card className="shadow-md max-w-2xl">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Yeni Mesaj Gonder
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="subject">
                  Konu
                </label>
                <Input
                  id="subject"
                  placeholder="Mesajinizin konusunu yazin"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={200}
                  disabled={sending}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="content">
                  Icerik
                </label>
                <Textarea
                  id="content"
                  placeholder="Mesajinizi yazin..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={7}
                  disabled={sending}
                  className="resize-none"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={sending}
                  className="font-bold uppercase text-xs tracking-wide bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {sending ? "Gonderiliyor..." : "Gonder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setView("inbox");
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={sending}
                  className="font-bold uppercase text-xs tracking-wide"
                >
                  Iptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
