"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
import { NotificationsModal } from "@/components/dashboard/notifications/NotificationsModal";
import { useOrganisation } from "@/hooks/api/useOrganisation";

const Topbar = () => {
  const router = useRouter();
  const { data: org } = useOrganisation();
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: notifications } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const unreadCount = notifications?.length ?? 0;
  const previewNotifications = notifications?.slice(0, 5) ?? [];

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

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
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
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
              <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                {org?.name ?? "My Workspace"}
              </h1>
              <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>
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
                  className="relative h-10 w-10 rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600 data-[state=open]:bg-brand-500/10 data-[state=open]:text-brand-600 dark:hover:text-brand-400 dark:data-[state=open]:text-brand-400"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 overflow-hidden rounded-2xl p-0 shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-muted/30 p-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500/10 px-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-lg px-2 text-xs text-muted-foreground hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
                    onClick={() => markAllAsRead()}
                    disabled={unreadCount === 0 || isMarkingAll}
                  >
                    Mark all read
                  </Button>
                </div>

                {/* List or empty state */}
                {unreadCount === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
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
                  <>
                    <div className="divide-y divide-border">
                      {previewNotifications.map((n) => (
                        <NotificationRow
                          key={n.id}
                          notification={n}
                          onClick={() => handleNotificationClick(n)}
                        />
                      ))}
                    </div>
                    <div className="border-t border-border p-2">
                      <Button
                        variant="ghost"
                        className="h-8 w-full rounded-lg text-xs font-medium text-brand-600 hover:bg-brand-500/10 hover:text-brand-700 dark:text-brand-400"
                        onClick={() => {
                          setPopoverOpen(false);
                          setModalOpen(true);
                        }}
                      >
                        View all {unreadCount} notifications
                      </Button>
                    </div>
                  </>
                )}
              </PopoverContent>
            </Popover>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Settings"
              className="h-10 w-10 rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Divider */}
            <span className="mx-1 hidden h-6 w-px bg-border sm:block" />

            {/* Clerk profile */}
            {mounted && (
              <div className="flex items-center rounded-full ring-2 ring-brand-500/15">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                      userButtonPopoverCard:
                        "shadow-lg border border-border rounded-2xl",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notifications={notifications ?? []}
      />
    </>
  );
};

export default Topbar;
