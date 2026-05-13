"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/hooks/api/useNotifications";
import { Notification } from "@/types";
import { NotificationRow } from "@/components/dashboard/notifications/NotificationRow";

const Topbar = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [mounted, setMounted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: notifications } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const unreadCount = notifications?.length ?? 0;

  useEffect(() => setMounted(true), []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setPopoverOpen(false);
    // Navigate based on entityType
    if (notification.entityType === "BOOKING") {
      router.push("/dashboard/bookings");
    }
    // Future: STAFF → /dashboard/staff, etc.
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Show menu on tablet + mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open sidebar"
              onClick={toggleSidebar}
              className="h-10 w-10 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Organization name */}
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
              Acme Organization
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Workspace Overview
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg px-2 text-xs"
                  onClick={() => markAllAsRead()}
                  disabled={unreadCount === 0 || isMarkingAll}
                >
                  Mark all read
                </Button>
              </div>

              {/* List or empty state */}
              {unreadCount === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  You're all caught up.
                </div>
              ) : (
                <div className="max-h-[400px] divide-y divide-border overflow-y-auto">
                  {notifications!.map((n) => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      onClick={() => handleNotificationClick(n)}
                    />
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="h-10 w-10 rounded-xl"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Clerk profile */}
          {mounted && (
            <div className="ml-1 flex items-center">
              <UserButton
                // afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                    userButtonPopoverCard: "shadow-lg border border-border",
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
