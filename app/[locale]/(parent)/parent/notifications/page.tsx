"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Bell, BellOff, CheckCheck } from "lucide-react";

type NotificationType = "PAYMENT_DUE" | "ATTENDANCE" | "SCHEDULE_CHANGE" | "GENERAL";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<NotificationType, string> = {
  PAYMENT_DUE: "Ödeme",
  ATTENDANCE: "Devamsızlık",
  SCHEDULE_CHANGE: "Program Değişikliği",
  GENERAL: "Genel",
};

const TYPE_COLORS: Record<NotificationType, string> = {
  PAYMENT_DUE: "bg-red-100 text-red-700 border-red-200",
  ATTENDANCE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  SCHEDULE_CHANGE: "bg-blue-100 text-blue-700 border-blue-200",
  GENERAL: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/parent/notifications");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await fetch("/api/parent/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Revert optimistic update on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await fetch("/api/parent/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      await fetchNotifications();
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bildirimler</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} okunmamış bildiriminiz var`
              : "Tüm bildirimler okundu"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={markingAll}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Tümünü okundu işaretle
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Tüm Bildirimler
            {unreadCount > 0 && (
              <Badge className="ml-1 bg-primary text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BellOff className="h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg font-medium">Bildiriminiz yok</p>
              <p className="text-sm mt-1">Yeni bildirimler burada görünecek</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex gap-4 py-4 px-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full mt-1 ${
                        notification.isRead
                          ? "bg-transparent"
                          : "bg-primary"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${
                          notification.isRead
                            ? "font-normal text-foreground"
                            : "font-bold text-foreground"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <span className="flex-shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
                          TYPE_COLORS[notification.type as NotificationType] ??
                          TYPE_COLORS.GENERAL
                        }`}
                      >
                        {TYPE_LABELS[notification.type as NotificationType] ??
                          notification.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
