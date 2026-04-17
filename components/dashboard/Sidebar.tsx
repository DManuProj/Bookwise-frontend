"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import Logo from "@/components/shared/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/dashboard/services", icon: Scissors, label: "Services" },
  { href: "/dashboard/staff", icon: Users, label: "Staff" },
  { href: "/dashboard/customers", icon: UserRound, label: "Customers" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              isActive={isActive}
              className={cn(
                "h-10 rounded-lg mt-2",
                isActive
                  ? "bg-brand-500/15 text-brand-600 hover:bg-brand-500/20 hover:text-brand-700 dark:text-brand-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Link href={item.href}>
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-brand-500"
                      : "text-muted-foreground group-hover/menu-button:text-foreground",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function SidebarCollapseButton() {
  const { state, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) return null;

  const isCollapsed = state === "collapsed";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="absolute overflow-hidden -right-3.5 top-[18px] z-[9999] hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all duration-150 hover:bg-brand-500 hover:text-white hover:border-brand-500 md:flex"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ChevronsRight className="h-3.5 w-3.5" />
      ) : (
        <ChevronsLeft className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

const Sidebar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { state } = useSidebar();
  //   const [mounted, setMounted] = useState(false);

  //   useEffect(() => setMounted(true), []);

  const isCollapsed = state === "collapsed";

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.firstName?.[0]?.toUpperCase() ?? "U");

  return (
    <AppSidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-border relative z-50"
    >
      <div className="relative">
        <SidebarCollapseButton />
      </div>

      <SidebarHeader className="h-16 border-b grid items-center overflow-hidden ">
        <div className=" ">
          <Logo />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarNav />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div
          className={cn(
            "flex items-center rounded-lg px-2 py-2",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ""} />
            <AvatarFallback className="bg-brand-500/15 text-sm font-semibold text-brand-600 dark:text-brand-400">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.fullName ?? user?.firstName ?? "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={() => signOut({ redirectUrl: "/" })}
          className={cn(
            "mt-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            isCollapsed ? "mx-auto flex h-9 w-9" : "w-full justify-start",
          )}
          aria-label="Sign out"
          title={isCollapsed ? "Sign out" : undefined}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Sign out"}
        </Button>
      </SidebarFooter>
    </AppSidebar>
  );
};

export default Sidebar;
