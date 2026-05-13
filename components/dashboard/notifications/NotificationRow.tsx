"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { Notification } from "@/types";
import { NOTIFICATION_CONFIG } from "./notificationConfig";

interface NotificationRowProps {
  notification: Notification;
  onClick: () => void;
}

export const NotificationRow = ({
  notification,
  onClick,
}: NotificationRowProps) => {
  const config = NOTIFICATION_CONFIG[notification.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
    >
      {/* Icon circle */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.bg}`}
      >
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>

      {/* Text block */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {formatDistanceToNow(parseISO(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </button>
  );
};
