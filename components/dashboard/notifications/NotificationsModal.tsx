"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { CheckCheck, Bell } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types";
import { NOTIFICATION_CONFIG } from "./notificationConfig";
import { useMarkAllAsRead, useMarkAsRead } from "@/hooks/api/useNotifications";

const TYPE_BORDER: Record<string, string> = {
  BOOKING: "border-l-blue-500",
  STAFF: "border-l-brand-500",
  LEAVE: "border-l-amber-500",
  ROLE: "border-l-purple-500",
  SERVICE: "border-l-slate-400",
};

export const NotificationsModal = ({
  open,
  onClose,
  notifications,
}: {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}) => {
  const [items, setItems] = useState<Notification[]>([]);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending } = useMarkAllAsRead();

  // Snapshot on open so marked-read items stay visible in the modal
  useEffect(() => {
    if (open) setItems(notifications);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = items.filter((n) => !n.isRead).length;

  const handleMarkOne = (id: string) => {
    markAsRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAll = () => {
    markAllAsRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[460px] gap-0 overflow-hidden rounded-2xl p-0">
        {/* Header — pr-12 leaves room for the built-in Dialog close (X) button */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 py-3 pl-4 pr-12">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500/10 px-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                {unreadCount}
              </span>
            )}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
            onClick={handleMarkAll}
            disabled={unreadCount === 0 || isPending}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Bell className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium text-foreground">
              You&apos;re all caught up
            </p>
            <p className="text-xs text-muted-foreground">
              New notifications will show up here.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[520px]">
            <div className="divide-y divide-border">
              {items.map((n) => {
                const config = NOTIFICATION_CONFIG[n.type];
                const Icon = config.icon;
                const isUnread = !n.isRead;

                return (
                  <button
                    key={n.id}
                    onClick={() => isUnread && handleMarkOne(n.id)}
                    className={[
                      "group relative flex w-full items-start gap-3 border-l-[3px] py-3.5 pl-3.5 pr-4 text-left transition-colors",
                      isUnread
                        ? `${TYPE_BORDER[n.type] ?? "border-l-brand-500"} bg-brand-500/[0.03] hover:bg-muted/50`
                        : "cursor-default border-l-transparent",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        config.bg,
                        isUnread ? "" : "opacity-40",
                      ].join(" ")}
                    >
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium leading-snug ${
                            isUnread
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {n.title}
                        </p>
                        {isUnread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500 ring-2 ring-brand-500/20" />
                        )}
                      </div>
                      <p
                        className={`mt-0.5 text-xs leading-relaxed ${
                          isUnread
                            ? "text-muted-foreground"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="mt-1.5 text-[10px] text-muted-foreground/50">
                        {formatDistanceToNow(parseISO(n.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
