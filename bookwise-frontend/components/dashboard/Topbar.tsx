"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

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
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500" />
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-popover p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Notifications
                  </h3>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg px-2 text-xs"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Close
                  </Button>
                </div>

                <div className="rounded-xl bg-muted/40 py-8 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              </div>
            )}
          </div>

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
