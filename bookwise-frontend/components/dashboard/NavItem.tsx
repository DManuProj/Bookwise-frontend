"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
};

const NavItem = ({ href, icon: Icon, label, collapsed }: Props) => {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
        isActive
          ? "bg-brand-500/15 text-brand-600 dark:text-brand-400"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-brand-500"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export default NavItem;
