import React from "react";
import { Calendar } from "lucide-react";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-full items-center px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-500" />
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span className="text-sm font-semibold text-brand-500">Bookwise</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
