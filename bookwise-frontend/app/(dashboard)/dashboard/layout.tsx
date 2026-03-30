"use client";

import type { ReactNode } from "react";
import Topbar from "@/components/dashboard/Topbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarProvider>
        <Sidebar />

        {/* Main area — add relative and lower z so sidebar button shows above */}
        <div className="flex flex-col flex-1 min-w-0  overflow-hidden relative">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
